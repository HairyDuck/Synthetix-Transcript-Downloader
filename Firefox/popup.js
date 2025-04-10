// Default settings now includes environment and download option
const defaultSettings = {
  apiEnvironment: 'production', // Default environment
  applicationKey: '',
  consumerKey: '',
  username: '',
  password: '',
  saveToSubfolder: false, // Default is not to save in subfolder
  downloadAsZip: true // Default is to download as ZIP
};

// Helper function to send message to background script (Firefox)
async function sendMessageToBackground(messagePayload) {
  try {
    // browser.runtime.sendMessage returns a Promise directly
    const response = await browser.runtime.sendMessage(messagePayload);
    console.log('Response from background:', response); // Debugging
    // No need to check lastError with Promises, errors are thrown/rejected
    return response;
  } catch (error) {
    console.error('Failed to send message or background error:', error, messagePayload);
    return { error: error.message };
  }
}

// Log message function (uses browser.runtime)
async function log(message) {
  // No need to await sendMessage if we don't care about the immediate response
  sendMessageToBackground({ action: "addLog", message: message }); 
  displayLogEntryInPopup(message);
}

// Function to display a single log entry in the popup UI
function displayLogEntryInPopup(message) {
  const logDiv = document.getElementById('log');
  if (logDiv) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${message}`;
    logDiv.innerHTML += entry + '<br>';
    logDiv.scrollTop = logDiv.scrollHeight; // Scroll to bottom
  } else {
    console.error("Error: Could not find 'log' div to display message:", message);
  }
}

// Function to display multiple log entries (used on load)
function displayLogEntriesInPopup(entries) {
  const logDiv = document.getElementById('log');
  if (logDiv) {
    logDiv.innerHTML = entries.join('<br>') + (entries.length > 0 ? '<br>' : ''); // Add trailing <br> if not empty
    logDiv.scrollTop = logDiv.scrollHeight; // Scroll to bottom
  } else {
    console.error("Error: Could not find 'log' div to display entries");
  }
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  // --- Get elements and attach listeners immediately ---
  const downloadButton = document.getElementById('downloadButton');
  const instructionsLink = document.getElementById('instructionsLink');
  const settingsLink = document.getElementById('settingsLink');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  if (downloadButton) {
    downloadButton.addEventListener('click', downloadTranscripts);
  } else {
    console.error("Error: Could not find 'downloadButton'");
  }

  if (instructionsLink) {
    instructionsLink.addEventListener('click', (e) => {
      e.preventDefault(); // Good practice
      browser.tabs.create({ url: browser.runtime.getURL('instructions.html') });
    });
  } else {
    console.error("Error: Could not find 'instructionsLink'");
  }

  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault(); // Good practice
      browser.runtime.openOptionsPage(); // Correct API for Firefox
    });
  } else {
    console.error("Error: Could not find 'settingsLink'");
  }

  // --- Add link for full log ---
  const viewFullLogLink = document.getElementById('viewFullLogLink');

  // --- Attach listeners immediately ---
  if (viewFullLogLink) {
    viewFullLogLink.addEventListener('click', (e) => {
      e.preventDefault();
      browser.tabs.create({ url: browser.runtime.getURL('log.html') });
    });
  } else {
    console.error("Error: Could not find 'viewFullLogLink'");
  }

  // --- Handle asynchronous setup and checks ---
  (async () => {
    try {
      // Set default dates
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      if (startDateInput) startDateInput.value = lastWeek.toISOString().split('T')[0];
      if (endDateInput) endDateInput.value = today.toISOString().split('T')[0];

      // --- Load initial log tail from background ---
      const logResponse = await sendMessageToBackground({ action: "getLogTail" });
      if (logResponse && logResponse.logTail) {
        displayLogEntriesInPopup(logResponse.logTail);
      } else {
          await log("Could not load previous log entries."); // Log error via background
      }

      // Load saved settings
      const settings = await browser.storage.local.get(defaultSettings);
      
      // Check if this is the first run (instructions check)
      const { hasSeenInstructions } = await browser.storage.local.get('hasSeenInstructions');
      if (!hasSeenInstructions) {
        // Show instructions in a new tab
        browser.tabs.create({ url: browser.runtime.getURL('instructions.html') });
        // Mark instructions as seen
        await browser.storage.local.set({ hasSeenInstructions: true });
        // Log initial message even on first run
        await log('Welcome! Please configure your settings using the link below.');
        return; // No need to check settings again if it's the first instruction run
      }
      
      // Check if settings are configured (only if instructions have been seen)
      const isUnconfigured = !settings.applicationKey || !settings.consumerKey || !settings.username || !settings.password;
      if (isUnconfigured) {
        await log('Please configure your settings using the link below.');
      }
    } catch (error) {
      console.error("Error during async setup:", error);
      // Use the new log function which sends to background
      await log("An error occurred during popup setup."); 
    }
  })(); // Immediately invoke the async function
});

// Download transcripts
async function downloadTranscripts() {
  // Clear DOM log on new download attempt (background log persists)
  const logDiv = document.getElementById('log');
  if (logDiv) logDiv.innerHTML = ''; 
  else console.error("Cannot clear popup log, 'log' div not found");

  // Use the new log() function throughout, which sends to background
  await log('Starting download process...'); 

  try {
    // Load settings including environment and subfolder option
    const settings = await browser.storage.local.get(defaultSettings);
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    // Validate settings (excluding environment for now)
    if (!settings.applicationKey || !settings.consumerKey || !settings.username || !settings.password) {
      await log('Error: Please configure your settings first (click "Open Settings" below).');
      return;
    }
    
    // Validate dates
    if (!startDate || !endDate) {
        await log('Error: Please select valid start and end dates.');
        return;
    }

    await log('Logging in...');
    
    // *** Construct API URL based on environment setting ***
    let apiUrlBase;
    switch (settings.apiEnvironment) {
      case 'staging':
        apiUrlBase = 'https://apistaging.synthetix.com';
        break;
      case 'sandbox':
        apiUrlBase = 'https://apisandbox.synthetix.com';
        break;
      case 'production': // Fallthrough intended for default
      default: // Handle unset or unexpected values
        apiUrlBase = 'https://api.synthetix.com';
        break;
    }
    await log(`Using API Environment: ${settings.apiEnvironment || 'production'} (${apiUrlBase})`);
    
    // Login and get token
    const loginResponse = await fetch(`${apiUrlBase}/2.0/internal/session`, {
      method: 'POST',
      headers: {
        'APPLICATIONKEY': settings.applicationKey,
        'CONSUMERKEY': settings.consumerKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: settings.username,
        password: settings.password
      })
    });

    if (!loginResponse.ok) {
       const errorText = await loginResponse.text();
       console.error('Login API Error:', loginResponse.status, errorText);
       throw new Error(`Login failed (${loginResponse.status}). Check network or API status.`); 
    }

    const loginData = await loginResponse.json();
    
    // Check authorization status
    if (loginData.authorised !== true) { 
      console.error('Login Authorization Failed via /session:', loginData);
      const errorMessage = typeof loginData.authorised === 'string' ? loginData.authorised : 'Invalid credentials or service account not authorized.';
      await log(`Login failed: ${errorMessage}`);
      throw new Error(`Login failed: ${errorMessage}`);
    }
    
    // Check for the token only if authorized
    if (!loginData.token) {
      console.error('Login response from /session missing token (authorised=true):', loginData);
      await log('Login authorized, but no token received.');
      throw new Error('Login authorized, but no token received...');
    }

    await log('Login successful. Fetching chat IDs...');

    // Get chat IDs
    const chatIdsResponse = await fetch(
      `${apiUrlBase}/2.0/internal/chatids?startdate=${startDate}&enddate=${endDate}`,
      {
        headers: {
          'APPLICATIONKEY': settings.applicationKey,
          'CONSUMERKEY': settings.consumerKey,
          'Authorization': `Bearer ${loginData.token}`
        }
      }
    );

    if (!chatIdsResponse.ok) {
      const errorText = await chatIdsResponse.text();
      console.error('Chat IDs API Error:', chatIdsResponse.status, errorText);
      throw new Error(`Failed to fetch chat IDs (${chatIdsResponse.status}).`);
    }

    const chatIds = await chatIdsResponse.json();
    if (!Array.isArray(chatIds)) {
        console.error('Unexpected response format for chat IDs:', chatIds);
        throw new Error('Received unexpected data format when fetching chat IDs.');
    }
    
    if (chatIds.length === 0) {
        await log('No chats found for the selected date range.');
        return;
    }
    
    await log(`Found ${chatIds.length} chats. Downloading transcripts...`);

    // Determine base filename prefix
    const subfolder = settings.saveToSubfolder ? 'SynthetixTranscripts/' : '';

    // Check if we should download as a single ZIP file
    if (settings.downloadAsZip) {
      await log('Preparing to download as a single ZIP file...');
      
      // First, collect all transcripts
      const transcripts = {};
      let successCount = 0;
      let failCount = 0;
      
      for (const chatId of chatIds) {
        try {
          const detailsResponse = await fetch(`${apiUrlBase}/2.0/livechat/details`, {
            method: 'POST',
            headers: {
              'APPLICATIONKEY': settings.applicationKey,
              'CONSUMERKEY': settings.consumerKey,
              'Authorization': `Bearer ${loginData.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              uniQref: chatId
            })
          });

          if (detailsResponse.ok) {
            const transcriptData = await detailsResponse.json();
            transcripts[`SynthetixTranscript_${chatId}.json`] = JSON.stringify(transcriptData, null, 2);
            successCount++;
            await log(`Retrieved transcript: ${chatId}`); 
          } else {
            const errorText = await detailsResponse.text();
            console.error(`Transcript details API error for ${chatId}:`, detailsResponse.status, errorText);
            await log(`Error fetching details for transcript ${chatId} (${detailsResponse.status}).`);
            failCount++;
          }
        } catch (error) {
          console.error(`Error processing transcript ${chatId}:`, error);
          await log(`Error processing transcript ${chatId}: ${error.message}`);
          failCount++;
        }
      }
      
      if (successCount === 0) {
        await log('Failed to retrieve any transcripts. Nothing to download.');
        return;
      }
      
      await log(`Successfully retrieved ${successCount} transcripts. Creating ZIP file...`);
      
      try {
        
        // Create a new zip file
        const zip = new JSZip();
        
        // Add each transcript to the zip
        for (const [filename, content] of Object.entries(transcripts)) {
          zip.file(filename, content);
        }
        
        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });
        
        // Download the zip file
        const zipUrl = URL.createObjectURL(zipContent);
        const dateStr = new Date().toISOString().split('T')[0];
        const zipFilename = `${subfolder}SynthetixTranscripts_${dateStr}.zip`;
        
        // Use browser.downloads API
        const downloadId = await browser.downloads.download({
          url: zipUrl,
          filename: zipFilename,
          saveAs: false
        });
        console.log(`Download initiated with ID: ${downloadId}`);
        
        await log(`Downloaded ZIP file with ${successCount} transcripts: ${zipFilename}`);
        return;
      } catch (error) {
        console.error('Error creating ZIP file:', error);
        await log(`Error creating ZIP file: ${error.message}`);
        await log('Falling back to individual file downloads...');
        // Fall through to individual downloads
      }
    }

    // If not downloading as ZIP or if ZIP failed, download individual files
    let successCount = 0;
    let failCount = 0;
    for (const chatId of chatIds) {
      try {
        const detailsResponse = await fetch(`${apiUrlBase}/2.0/livechat/details`, {
          method: 'POST',
          headers: {
            'APPLICATIONKEY': settings.applicationKey,
            'CONSUMERKEY': settings.consumerKey,
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            uniQref: chatId
          })
        });

        if (detailsResponse.ok) {
          const transcriptData = await detailsResponse.json();
          
          // Create and download the file
          const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          // *** Construct filename with optional subfolder ***
          const filename = `${subfolder}SynthetixTranscript_${chatId}.json`;
          
          try {
              // Use browser.downloads.download
              const downloadId = await browser.downloads.download({
                url: url,
                filename: filename, 
                saveAs: false
              });
              // Firefox returns downloadId, Chrome returns void (or undefined)
              console.log(`Download initiated with ID: ${downloadId}`);
              // Firefox manages temporary blob URLs, no explicit revoke needed here usually
              successCount++;
              await log(`Downloaded transcript: ${filename}`);
          } catch (downloadError) {
              console.error(`Download API error for ${chatId}:`, downloadError);
              await log(`Error initiating download for transcript ${chatId} to ${filename}: ${downloadError.message}`);
              failCount++;
          }
        } else {
            const errorText = await detailsResponse.text();
            console.error(`Transcript details API error for ${chatId}:`, detailsResponse.status, errorText);
            await log(`Error fetching details for transcript ${chatId} (${detailsResponse.status}).`);
            failCount++;
        }
      } catch (error) {
        console.error(`Error processing transcript ${chatId}:`, error);
        await log(`Error processing transcript ${chatId}: ${error.message}`);
        failCount++;
      }
    }

    await log(`Download process finished. Successfully downloaded: ${successCount}. Failed: ${failCount}.`);
  } catch (error) {
    console.error('Download Transcript Error:', error);
    await log(`Download failed. See previous messages or console for details.`);
  }
} 