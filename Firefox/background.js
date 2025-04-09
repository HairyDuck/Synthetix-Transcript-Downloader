// background.js - Service Worker (Firefox)

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
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request); // Debugging
  
  let response = {};
  // Use a flag or direct return of Promise for async handling in Firefox

  switch (request.action) {
    case "addLog":
      if (request.message) {
        addLogEntry(request.message);
        response = { success: true };
      } else {
        response = { success: false, error: "No message provided" };
      }
      break; // Synchronous response is fine here
      
    case "getLogTail":
      response = { logTail: getLogTail() };
      break; // Synchronous
      
    case "getFullLog":
      response = { fullLog: [...sessionLog] }; // Send a copy
      break; // Synchronous
      
    case "clearLog":
      sessionLog = [];
      console.log("Session log cleared.");
      response = { success: true };
      // Send message to update any open log views
      browser.runtime.sendMessage({ action: "logCleared" }).catch(e => console.error("Error sending logCleared message:", e)); 
      break; // Synchronous
      
    default:
      console.warn("Background received unknown action:", request.action);
      response = { error: "Unknown action" };
      break; // Synchronous
  }
  
  // For sync responses, just return the value or a Promise resolving to it.
  // For truly async operations later, return the Promise directly.
  return Promise.resolve(response); 
});

// Optional: Log when the service worker starts
console.log("Background script started (Firefox).");
addLogEntry("Background script initialized (Firefox)."); 