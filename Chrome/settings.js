// Default settings
const defaultSettings = {
  applicationKey: '',
  consumerKey: '',
  username: '',
  password: ''
};

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

  // Load saved settings
  const settings = await chrome.storage.local.get([
    'apiEnvironment',
    'applicationKey',
    'consumerKey',
    'username',
    'password',
    'saveToSubfolder'
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
    passwordInput.type = 'password'; // Ensure it's obfuscated
  }
  saveToSubfolderCheckbox.checked = !!settings.saveToSubfolder;

  // Toggle password visibility
  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // Save settings
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
      saveToSubfolder: saveToSubfolderCheckbox.checked
    });

    // Ensure passwords are obfuscated after saving
    applicationKeyInput.type = 'password';
    consumerKeyInput.type = 'password';
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show';

    showStatus('Settings saved successfully', 'success');
  });

  // Test Connection Logic
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

      const responseData = await response.json();

      // Check response
      if (response.ok && responseData.authorised === true) {
        showStatus(`Connection successful to ${currentEnv} environment!`, 'success');
      } else {
        const errorMessage = typeof responseData.authorised === 'string' ? responseData.authorised : 'Invalid credentials or service account not authorized.';
        showStatus(`Connection failed: ${errorMessage}`, 'error');
      }

    } catch (error) {
      console.error('Test Connection Error:', error);
      showStatus(`Connection error: ${error.message}. Check console for details.`, 'error');
    } finally {
      // Hide spinner and re-enable button
      testSpinner.style.display = 'none';
      testConnectionButton.disabled = false;
    }
  });

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