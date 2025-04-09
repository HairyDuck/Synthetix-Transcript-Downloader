// log.js - Script for the full log page (Firefox)

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

// Function to display the full log
function displayFullLog(logEntries) {
  const logDiv = document.getElementById('fullLog');
  if (logDiv) {
    if (logEntries && logEntries.length > 0) {
        // Using textContent handles potential HTML in messages safely
        logDiv.textContent = logEntries.join('\n'); 
    } else {
        logDiv.textContent = 'Log is currently empty.';
    }
    // Scroll to the bottom (optional, might be annoying for full log)
    // logDiv.scrollTop = logDiv.scrollHeight;
  } else {
    console.error("Could not find 'fullLog' div.");
  }
}

// --- Initialize Page ---
document.addEventListener('DOMContentLoaded', async () => {
  const clearLogButton = document.getElementById('clearLogButton');

  // Load the full log initially (uses browser.runtime)
  const response = await sendMessageToBackground({ action: "getFullLog" });
  if (response && response.fullLog) {
    displayFullLog(response.fullLog);
  } else {
    displayFullLog(["Error loading log from background service."]);
  }

  // Add listener for the clear button (uses browser.runtime)
  if (clearLogButton) {
    clearLogButton.addEventListener('click', async () => {
      const confirmClear = confirm("Are you sure you want to clear the entire session log?");
      if (confirmClear) {
          const clearResponse = await sendMessageToBackground({ action: "clearLog" });
          if (clearResponse && clearResponse.success) {
              displayFullLog([]); // Clear the display immediately
          } else {
              alert("Failed to clear log. See console for details.");
          }
      }
    });
  } else {
      console.error("Could not find 'clearLogButton'");
  }

  // Listen for messages from background (uses browser.runtime)
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "logCleared") {
          console.log("Received logCleared message, updating display.");
          displayFullLog([]);
      }
      // It's good practice to return false or undefined if not sending an async response
      // from this listener, though in this case we aren't.
  });
}); 