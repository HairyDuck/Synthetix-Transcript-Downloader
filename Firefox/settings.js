// Default settings for Firefox version
const defaultSettings = {
  applicationKey: '',
  consumerKey: '',
  username: '',
  password: '',
  apiEnvironment: 'production',
  saveToSubfolder: false,
  downloadAsZip: true
};

// Helper function (uses browser.runtime)
async function sendMessageToBackground(messagePayload) {
  try {
    const response = await browser.runtime.sendMessage(messagePayload);
    console.log('Response from background:', response);
    return response;
  } catch (error) {
    console.error('Failed to send message or background error:', error, messagePayload);
    return { error: error.message };
  }
}

// Initialize the settings page
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const environmentSelect = document.getElementById('apiEnvironment');
  const applicationKeyInput = document.getElementById('applicationKey');
  const consumerKeyInput = document.getElementById('consumerKey');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const saveButton = document.getElementById('saveButton');
  const testConnectionButton = document.getElementById('testConnectionButton');
  const testSpinner = document.getElementById('testSpinner');
  const statusDiv = document.getElementById('status');
  const togglePasswordButton = document.getElementById('togglePassword');
  const saveToSubfolderCheckbox = document.getElementById('saveToSubfolder');

  // Navigation Links
  const backToExtensionLink = document.querySelector('.navigation a[href="popup.html"]');
  const viewInstructionsLink = document.querySelector('.navigation a[href="instructions.html"]');

  // Load saved settings (uses browser.storage)
  const settings = await browser.storage.local.get([
    'apiEnvironment',
    'applicationKey',
    'consumerKey',
    'username',
    'password',
    'saveToSubfolder',
    'downloadAsZip'
  ]);

  // Populate form with saved settings
  if (settings.apiEnvironment) {
    environmentSelect.value = settings.apiEnvironment;
  } else {
    environmentSelect.value = 'production'; // Default to production if not set
  }
  if (settings.applicationKey) {
    applicationKeyInput.value = settings.applicationKey;
    applicationKeyInput.type = 'password'; // Ensure it's obfuscated
  }
  if (settings.consumerKey) {
    consumerKeyInput.value = settings.consumerKey;
    consumerKeyInput.type = 'password'; // Ensure it's obfuscated
  }
  if (settings.username) {
    usernameInput.value = settings.username;
  }
  if (settings.password) {
    passwordInput.value = settings.password;
    passwordInput.type = 'password';
  }
  saveToSubfolderCheckbox.checked = !!settings.saveToSubfolder;
  
  const downloadAsZipCheckbox = document.getElementById('downloadAsZip');
  if (downloadAsZipCheckbox) {
    downloadAsZipCheckbox.checked = !!settings.downloadAsZip;
  }

  // Toggle password visibility
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Save Settings (uses browser.storage)
  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      // Validate inputs
      if (!applicationKeyInput.value || !consumerKeyInput.value || !usernameInput.value || !passwordInput.value) {
        showStatus('Please fill in all credential fields', 'error');
        return;
      }

      try { // Add try/catch for storage operation
        await browser.storage.local.set({
          apiEnvironment: environmentSelect.value,
          applicationKey: applicationKeyInput.value,
          consumerKey: consumerKeyInput.value,
          username: usernameInput.value,
          password: passwordInput.value,
          saveToSubfolder: saveToSubfolderCheckbox.checked,
          downloadAsZip: downloadAsZipCheckbox.checked
        });

        // Ensure passwords are obfuscated after saving
        applicationKeyInput.type = 'password';
        consumerKeyInput.type = 'password';
        passwordInput.type = 'password';
        togglePasswordButton.textContent = 'Show';

        showStatus('Settings saved successfully', 'success');
      } catch (e) {
        console.error("Error saving settings:", e);
        showStatus(`Error saving settings: ${e.message}`, 'error');
      }
    });
  }

  // Test Connection (uses browser.runtime for messaging)
  if (testConnectionButton) {
    testConnectionButton.addEventListener('click', async () => {
      // Clear previous status and show spinner
      showStatus('', ''); // Clear status
      testSpinner.style.display = 'inline-block';
      testConnectionButton.disabled = true;

      // Get current values from the form (don't rely on saved values)
      const currentEnv = environmentSelect.value;
      const currentAppKey = applicationKeyInput.value;
      const currentConsumerKey = consumerKeyInput.value;
      const currentUsername = usernameInput.value;
      const currentPassword = passwordInput.value;

      // Basic validation
      if (!currentAppKey || !currentConsumerKey || !currentUsername || !currentPassword) {
        showStatus('Please fill in all credential fields to test.', 'error');
        testSpinner.style.display = 'none';
        testConnectionButton.disabled = false;
        return;
      }

      // Determine API URL
      let apiUrlBase;
      switch (currentEnv) {
        case 'staging':
          apiUrlBase = 'https://apistaging.synthetix.com';
          break;
        case 'sandbox':
          apiUrlBase = 'https://apisandbox.synthetix.com';
          break;
        default:
          apiUrlBase = 'https://api.synthetix.com';
          break;
      }

      try {
        // Attempt login (fetch is unchanged, sendMessageToBackground uses browser.*)
        const response = await fetch(`${apiUrlBase}/2.0/internal/session`, {
          method: 'POST',
          headers: {
            'APPLICATIONKEY': currentAppKey,
            'CONSUMERKEY': currentConsumerKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            username: currentUsername,
            password: currentPassword
          })
        });

        // Try to parse JSON regardless of response.ok to get potential error details
        let responseData = {};
        try {
          responseData = await response.json();
        } catch (jsonError) {
          // Handle cases where response is not JSON (e.g., network error page)
          console.error("Failed to parse JSON response:", jsonError);
          // Use status text if available and response not ok, otherwise generic error
          throw new Error(response.ok ? "Received non-JSON response." : 
                            `Request failed: ${response.status} ${response.statusText}`);
        }

        // Check response status AND content
        if (response.ok && responseData.authorised === true) {
          showStatus(`Connection successful to ${currentEnv} environment!`, 'success');
        } else {
          // Construct detailed error message
          let detail = `(${response.status})`;
          if (responseData.Error) detail += ` Code ${responseData.Error}`; 
          if (responseData.Description) detail += `: ${responseData.Description}`; 
          if (responseData.Level) detail += ` [${responseData.Level}]`;
          if (responseData.extraInfo) detail += ` (${responseData.extraInfo})`;

          // Fallback message if no specific details found
          const errorMessage = detail.length > 5 ? detail : 
                              (typeof responseData.authorised === 'string' ? responseData.authorised : 
                              'Invalid credentials or service account not authorized.');
                              
          showStatus(`Connection failed: ${errorMessage}`, 'error');
          console.error('Test Connection Response Data:', responseData); // Log full response for debugging
        }

      } catch (error) {
        console.error('Test Connection Fetch/Parse Error:', error);
        showStatus(`Connection error: ${error.message}. Check console.`, 'error');
      } finally {
        // Hide spinner and re-enable button
        testSpinner.style.display = 'none';
        testConnectionButton.disabled = false;
      }
    });
  }

  // Handle Back to Extension link (uses browser.tabs)
  if (backToExtensionLink) {
    backToExtensionLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.close();
    });
  }

  // Handle View Instructions link (uses browser.tabs)
  if (viewInstructionsLink) {
    viewInstructionsLink.addEventListener('click', (event) => {
      event.preventDefault();
      browser.tabs.create({ url: browser.runtime.getURL('instructions.html') });
    });
  }

  // Function to show status messages
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    // Don't auto-hide test connection messages
    // setTimeout(() => {
    //   statusDiv.className = 'status';
    // }, 3000);
  }
}); 