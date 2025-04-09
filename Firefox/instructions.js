document.addEventListener('DOMContentLoaded', async () => {
  // Check if instructions have been seen (uses browser.storage)
  try {
    const { hasSeenInstructions } = await browser.storage.local.get('hasSeenInstructions');
    if (!hasSeenInstructions) {
      await browser.storage.local.set({ hasSeenInstructions: true });
      console.log('Instructions marked as seen on first view.');
    }
  } catch (e) {
      console.error("Error checking/setting hasSeenInstructions:", e);
  }

  // Handle navigation links
  const backButton = document.querySelector('.navigation a[href="popup.html"]');
  const settingsButton = document.querySelector('.navigation a[href="settings.html"]');

  // Back to Extension -> Close Tab
  if (backButton) {
    backButton.addEventListener('click', async (event) => { // Make async
      event.preventDefault();
      try {
        const tab = await browser.tabs.getCurrent();
        if (tab && tab.id) {
            await browser.tabs.remove(tab.id);
        }
      } catch(e) {
          console.error("Error closing instructions tab:", e);
      }
    });
  }

  // Configure Settings -> Open Options Page
  if (settingsButton) {
    settingsButton.addEventListener('click', (event) => {
      event.preventDefault();
      browser.runtime.openOptionsPage();
    });
  }
}); 