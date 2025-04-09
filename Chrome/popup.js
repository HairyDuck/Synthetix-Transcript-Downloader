// Default settings now includes environment and download option
const defaultSettings = {
  apiEnvironment: 'production', // Default environment
  applicationKey: '',
  consumerKey: '',
  username: '',
  password: '',
  saveToSubfolder: false // Default is not to save in subfolder
};

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
    instructionsLink.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('instructions.html') });
    });
  } else {
    console.error("Error: Could not find 'instructionsLink'");
  }

  if (settingsLink) {
    settingsLink.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  } else {
    console.error("Error: Could not find 'settingsLink'");
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

      // Load saved settings
      const settings = await chrome.storage.local.get(defaultSettings);
      
      // Check if this is the first run (instructions check)
      const { hasSeenInstructions } = await chrome.storage.local.get('hasSeenInstructions');
      if (!hasSeenInstructions) {
        // Show instructions in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('instructions.html') });
        // Mark instructions as seen
        await chrome.storage.local.set({ hasSeenInstructions: true });
        // Log initial message even on first run
        log('Welcome! Please configure your settings using the link below.');
        return; // No need to check settings again if it's the first instruction run
      }
      
      // Check if settings are configured (only if instructions have been seen)
      const isUnconfigured = !settings.applicationKey || !settings.consumerKey || !settings.username || !settings.password;
      if (isUnconfigured) {
        log('Please configure your settings using the link below.');
      }
    } catch (error) {
      console.error("Error during async setup:", error);
      log("An error occurred during setup.");
    }
  })(); // Immediately invoke the async function
});

// Log messages to the log section
function log(message) {
  const logDiv = document.getElementById('log');
  if (logDiv) {
    const timestamp = new Date().toLocaleTimeString();
    logDiv.innerHTML += `[${timestamp}] ${message}<br>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  } else {
    console.error("Error: Could not find 'log' div to write message:", message);
  }
}

// Download transcripts
async function downloadTranscripts() {
  const logDiv = document.getElementById('log');
  if (logDiv) logDiv.innerHTML = '';
  else console.error("Cannot clear log, 'log' div not found");

  try {
    // Load settings including environment and subfolder option
    const settings = await chrome.storage.local.get(defaultSettings);
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    // Validate settings (excluding environment for now)
    if (!settings.applicationKey || !settings.consumerKey || !settings.username || !settings.password) {
      log('Error: Please configure your settings first (click "Open Settings" below).');
      return;
    }
    
    // Validate dates
    if (!startDate || !endDate) {
        log('Error: Please select valid start and end dates.');
        return;
    }

    log('Logging in...');
    
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
    log(`Using API Environment: ${settings.apiEnvironment || 'production'} (${apiUrlBase})`); // Log the environment being used
    
    // Login and get token (using the dynamically set apiUrlBase)
    const loginResponse = await fetch(`${apiUrlBase}/2.0/internal/session`, {
      method: 'POST',
      headers: {
        'APPLICATIONKEY': settings.applicationKey,
        'CONSUMERKEY': settings.consumerKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: settings.username, // Corrected parameter name
        password: settings.password  // Corrected parameter name
      })
    });

    if (!loginResponse.ok) {
       const errorText = await loginResponse.text();
       console.error('Login API Error:', loginResponse.status, errorText);
       throw new Error(`Login failed (${loginResponse.status}). Check network or API status.`); 
    }

    const loginData = await loginResponse.json();
    
    // *** Updated check for authorisation based on actual API response ***
    // Check if 'authorised' is not explicitly true (handles strings like "Invalid login details")
    if (loginData.authorised !== true) { 
      console.error('Login Authorization Failed via /session:', loginData); // Log the actual response
      // Use the error message from the API if it exists and is a string, otherwise use a default
      const errorMessage = typeof loginData.authorised === 'string' ? loginData.authorised : 'Invalid credentials or service account not authorized.';
      throw new Error(`Login failed: ${errorMessage}`);
    }
    
    // Check for the token only if authorized
    if (!loginData.token) {
      console.error('Login response from /session missing token (authorised=true):', loginData);
      throw new Error('Login authorized, but no authentication token received. API response format might have changed.');
    }

    log('Login successful. Fetching chat IDs...');

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
        log('No chats found for the selected date range.');
        return;
    }
    
    log(`Found ${chatIds.length} chats. Downloading transcripts...`);

    // Determine base filename prefix
    const subfolder = settings.saveToSubfolder ? 'SynthetixTranscripts/' : '';

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
              await chrome.downloads.download({
                url: url,
                filename: filename, // Use constructed filename
                saveAs: false
              });
              successCount++;
              log(`Downloaded transcript: ${filename}`); // Log full path
          } catch (downloadError) {
              console.error(`Chrome download API error for ${chatId}:`, downloadError);
              log(`Error initiating download for transcript ${chatId} to ${filename}: ${downloadError.message}`);
              failCount++;
          }
        } else {
            const errorText = await detailsResponse.text();
            console.error(`Transcript details API error for ${chatId}:`, detailsResponse.status, errorText);
            log(`Error fetching details for transcript ${chatId} (${detailsResponse.status}).`);
            failCount++;
        }
      } catch (error) {
        console.error(`Error processing transcript ${chatId}:`, error);
        log(`Error processing transcript ${chatId}: ${error.message}`);
        failCount++;
      }
    }

    log(`Download process finished. Successfully downloaded: ${successCount}. Failed: ${failCount}.`);
  } catch (error) {
    console.error('Download Transcript Error:', error);
    log(`Error: ${error.message}`);
  }
} 