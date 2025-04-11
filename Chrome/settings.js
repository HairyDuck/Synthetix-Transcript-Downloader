// Default settings
const defaultSettings = {
  applicationKey: '',
  consumerKey: '',
  username: '',
  password: '',
  apiEnvironment: 'production',
  saveToSubfolder: false,
  downloadAsZip: true
};

// Initialize the settings page
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const environmentSelect = document.getElementById('environment');
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

  // Load saved settings
  const settings = await chrome.storage.local.get([
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

  // Toggle Application Key visibility
  const toggleAppKeyButton = document.getElementById('toggleAppKey');
  if (toggleAppKeyButton && applicationKeyInput) {
    toggleAppKeyButton.addEventListener('click', () => {
      const type = applicationKeyInput.type === 'password' ? 'text' : 'password';
      applicationKeyInput.type = type;
      toggleAppKeyButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Toggle Consumer Key visibility
  const toggleConsumerKeyButton = document.getElementById('toggleConsumerKey');
  if (toggleConsumerKeyButton && consumerKeyInput) {
    toggleConsumerKeyButton.addEventListener('click', () => {
      const type = consumerKeyInput.type === 'password' ? 'text' : 'password';
      consumerKeyInput.type = type;
      toggleConsumerKeyButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Save settings
  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      // Validate inputs
      if (!applicationKeyInput.value || !consumerKeyInput.value || !usernameInput.value || !passwordInput.value) {
        showStatus('Please fill in all credential fields', 'error');
        return;
      }

      // Save settings
      await chrome.storage.local.set({
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
    });
  }

  // Test Connection Logic
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
        // Attempt login
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

        const message = [];
        
        // Try to parse JSON regardless of response status
        let responseData = {};
        try {
          responseData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
          throw new Error(response.ok ? "Received non-JSON response." : 
                            `Request failed: ${response.status} ${response.statusText}`);
        }

        // Check response status AND content
        if (response.ok && responseData.authorised === true) {
          showStatus(`Connection successful to ${currentEnv} environment!`, 'success');
        } else {
          // Construct detailed error message
          let detail = '';
          if (responseData.Description) detail += responseData.Description;
          // Only show extraInfo for BAD ORIGIN IP errors
          if (responseData.extraInfo && responseData.Description === 'BAD ORIGIN IP') {
            const extraInfo = typeof responseData.extraInfo === 'object' 
              ? JSON.stringify(responseData.extraInfo) 
              : responseData.extraInfo;
            detail += ` (${extraInfo})`;
          }

          // Add specific hints for common errors
          let hint = '';
          if (responseData.Description === 'BAD ORIGIN IP') {
            hint = '\n\nYour IP address is not whitelisted for API access. Please contact your Synthetix Account Manager to whitelist your IP address.';
          } else if (responseData.Description === 'NOT AUTHORISED' && responseData.Error === 204) {
            hint = '\n\nYour Application Key or Consumer Key appears to be incorrect. Please verify these credentials in your settings.';
          } else if (responseData.authorised === 'Invalid login details') {
            hint = '\n\nYour username or password is incorrect. Please verify your login credentials.';
          }

          // Fallback message if no specific details found
          const errorMessage = detail.length > 0 ? detail : 
                              (typeof responseData.authorised === 'string' ? responseData.authorised : 
                              'Invalid credentials or service account not authorized.');
                              
          showStatus(`Connection failed: ${errorMessage}${hint}`, 'error');
          console.error('Test Connection Response Data:', responseData);
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

  // Handle Back to Extension link
  if (backToExtensionLink) {
    backToExtensionLink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent opening popup.html
      // Close the current settings tab
      chrome.tabs.getCurrent(tab => {
        if (tab && tab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  }

  // Handle View Instructions link
  if (viewInstructionsLink) {
    viewInstructionsLink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default navigation
      // Open instructions.html in a new tab
      chrome.tabs.create({ url: chrome.runtime.getURL('instructions.html') });
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