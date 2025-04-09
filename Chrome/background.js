// background.js - Service Worker

// In-memory log for the current browser session
let sessionLog = [];
const MAX_TAIL_LENGTH = 50; // Max log entries for the popup tail

// Function to add a log entry with timestamp
function addLogEntry(message) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = `[${timestamp}] ${message}`;
  sessionLog.push(entry);
  console.log("Log Added:", entry); // Optional: Log to service worker console
}

// Function to get the tail of the log
function getLogTail() {
  const startIndex = Math.max(0, sessionLog.length - MAX_TAIL_LENGTH);
  return sessionLog.slice(startIndex);
}

// Listen for messages from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request); // Debugging
  
  let response = {};
  let needsResponse = false;

  switch (request.action) {
    case "addLog":
      if (request.message) {
        addLogEntry(request.message);
        response = { success: true };
      } else {
        response = { success: false, error: "No message provided" };
      }
      needsResponse = true;
      break;
      
    case "getLogTail":
      response = { logTail: getLogTail() };
      needsResponse = true;
      break;
      
    case "getFullLog":
      response = { fullLog: [...sessionLog] }; // Send a copy
      needsResponse = true;
      break;
      
    case "clearLog":
      sessionLog = [];
      console.log("Session log cleared.");
      response = { success: true };
      // Send message to update any open log views
      chrome.runtime.sendMessage({ action: "logCleared" }); 
      needsResponse = true;
      break;
      
    default:
      console.warn("Background received unknown action:", request.action);
      response = { error: "Unknown action" };
      needsResponse = true;
      break;
  }
  
  if (needsResponse) {
      // Use a Promise to handle potential async operations if needed in the future
      Promise.resolve(response).then(sendResponse);
      return true; // Indicates you will send a response asynchronously
  } 
  // Return false or undefined if not sending a response (though we handle all above)
});

// Optional: Log when the service worker starts
console.log("Background service worker started.");
addLogEntry("Background service worker initialized."); 