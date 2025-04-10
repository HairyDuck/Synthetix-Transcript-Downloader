// log.js - Script for the full log page

// Helper function to send message to background script
async function sendMessageToBackground(messagePayload) {
  try {
    const response = await chrome.runtime.sendMessage(messagePayload);
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError.message, messagePayload);
      return { error: chrome.runtime.lastError.message };
    }
    console.log('Response from background:', response);
    return response;
  } catch (error) {
    console.error('Failed to send message:', error, messagePayload);
    return { error: error.message };
  }
}

// Function to display the full log
function displayFullLog(logEntries) {
  const logDiv = document.getElementById('fullLog');
  if (logDiv) {
    if (logEntries && logEntries.length > 0) {
        logDiv.textContent = logEntries.join('\n'); 
    } else {
        logDiv.textContent = 'Log is currently empty.';
    }
  } else {
    console.error("Could not find 'fullLog' div.");
  }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', async () => {
  const clearLogButton = document.getElementById('clearLogButton');

  // Load the full log initially
  const response = await sendMessageToBackground({ action: "getFullLog" });
  if (response && response.fullLog) {
    displayFullLog(response.fullLog);
  } else {
    displayFullLog(["Error loading log from background service."]);
  }

  // Add listener for the clear button
  if (clearLogButton) {
    clearLogButton.addEventListener('click', async () => {
      const confirmClear = confirm("Are you sure you want to clear the entire session log?");
      if (confirmClear) {
          const clearResponse = await sendMessageToBackground({ action: "clearLog" });
          if (clearResponse && clearResponse.success) {
              displayFullLog([]);
          } else {
              alert("Failed to clear log. See console for details.");
          }
      }
    });
  } else {
      console.error("Could not find 'clearLogButton'");
  }

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "logCleared") {
          console.log("Received logCleared message, updating display.");
          displayFullLog([]);
      }
  });
}); 