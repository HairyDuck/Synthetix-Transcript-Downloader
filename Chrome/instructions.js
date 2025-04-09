document.addEventListener('DOMContentLoaded', async () => {
  // Check if this is first run
  const { hasSeenInstructions } = await chrome.storage.local.get('hasSeenInstructions');
  
  if (!hasSeenInstructions) {
    // Mark instructions as seen
    await chrome.storage.local.set({ hasSeenInstructions: true });
  }

  // Add event listeners for navigation
  const backButton = document.querySelector('a[href="popup.html"]');
  const settingsButton = document.querySelector('a[href="settings.html"]');

  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.close();
    });
  }

  if (settingsButton) {
    settingsButton.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }
}); 