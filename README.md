# Synthetix Transcript Downloader (Unofficial)

**⚠️ Important Disclaimer:** This is an unofficial Chrome extension developed independently. It is **not** created, maintained, supported, sponsored, or endorsed by Synthetix or any of its affiliates or subsidiaries. Use this extension at your own risk. For official Synthetix support and features, please contact your Synthetix Account Manager.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This Chrome extension allows users with appropriate Synthetix API access to download chat transcripts based on a selected date range. It requires specific API credentials linked to a **Synthetix Service Account**.

The extension provides a user-friendly interface within the browser to specify dates, manage settings securely, and monitor the download process.

## Features

*   **Date Range Selection:** Choose start and end dates for targeted transcript downloads.
*   **Environment Selection:** Connect to Production, Staging, or Sandbox Synthetix API environments via settings.
*   **Secure Credential Storage:** API keys and service account credentials are stored securely using Chrome's local storage (`chrome.storage.local`). Passwords and keys are obfuscated in the settings UI.
*   **Connection Testing:** Includes a button in settings to verify API credentials and environment selection before attempting downloads.
*   **Subfolder Downloads:** Option to save downloaded transcripts automatically into a `SynthetixTranscripts` subfolder within the browser's default Downloads directory.
*   **Clear Logging:** View progress, status messages, and any errors directly in the extension popup's log area.
*   **First-Run Instructions:** A detailed instructions page opens automatically upon first installation to guide users through setup.
*   **Modern UI:** Clean and consistent user interface across the popup, settings, and instructions pages.

## Installation

### Method 1: Chrome Web Store (Recommended)

*   [Install from Chrome Web Store](https://chromewebstore.google.com/detail/ndcacfbnjlggoolaginndlpdmkpomjba)

### Method 2: Local Development/Manual Install

1.  Clone or download this repository to your local machine.
    ```bash
    git clone <your-repository-url>
    cd Synthetix-Transcript-Downloader
    ```
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** using the toggle switch in the top-right corner.
4.  Click the **"Load unpacked"** button that appears.
5.  In the file dialog, navigate to and select the **`Chrome`** folder within the cloned `Synthetix-Transcript-Downloader` directory.
6.  The "Synthetix Transcript Downloader (Unofficial)" extension should now appear in your list of extensions and be ready to use.

## Usage Guide

1.  **Install** the extension using one of the methods above. The Instructions page should open automatically after installation.
2.  **Configure Settings:**
    *   Click the extension icon in your Chrome toolbar, then click the **"Open Settings"** link at the bottom of the popup. (Alternatively, right-click the extension icon and select "Options").
    *   On the Settings page:
        *   Select the appropriate **API Environment** (Production, Staging, or Sandbox) that your API keys are authorized for.
        *   Enter your Synthetix **Application Key**.
        *   Enter your Synthetix **Consumer Key**.
        *   Enter your Synthetix **Service Account Username**.
        *   Enter your Synthetix **Service Account Password**.
        *   **Crucially:** The username and password *must* belong to a **Service Account**, not a standard user account. Contact your Synthetix Account Manager if you don't have these.
        *   (Optional) Check the box to save downloads into the `SynthetixTranscripts` subfolder.
        *   Use the **"Test Connection"** button to verify your credentials and selected environment.
        *   Click **"Save Settings"**.
3.  **Download Transcripts:**
    *   Click the extension icon to open the popup.
    *   Select the desired **Start Date** and **End Date** using the date pickers.
    *   Click the **"Download Transcripts"** button.
    *   Monitor the download progress and any status messages in the **Log** section below the button.
    *   Files will be saved as `SynthetixTranscript_[ChatID].json` in your default Downloads folder (or the `SynthetixTranscripts` subfolder if the option was enabled).

## Screenshots

*   `![Popup Interface](docs/images/popup_screenshot.png)`
*   `![Settings Page](docs/images/settings_screenshot.png)`
*   `![Instructions Page](docs/images/instructions_screenshot.png)`

## Troubleshooting

*   **Login Failed / Invalid Credentials / Not Authorized:**
    *   Double-check every character of the Application Key, Consumer Key, Service Account Username, and Password in the Settings.
    *   Ensure you have selected the correct API Environment (Sandbox, Staging, Production) that your keys are valid for. New keys often only work in Sandbox initially.
    *   Confirm you are using **Service Account** credentials, not standard user credentials.
    *   Use the "Test Connection" button in Settings for quick verification.
*   **No Transcripts Found:** Verify the selected date range is correct and that chat interactions occurred within that period in the chosen environment.
*   **Download Errors / Network Errors:** Check the specific error message in the popup log. Ensure you have a stable internet connection. Check if there might be network restrictions or firewalls blocking access to the Synthetix API endpoints.
*   **Extension Not Working After Update:** Go to `chrome://extensions/`, find the extension, and click the refresh/reload icon. If problems persist, try removing and reinstalling the extension (your settings should be preserved if you reinstall quickly, but backup is always wise).

**Note:** As this is an unofficial tool, the developer cannot assist with issues related to obtaining API keys, Synthetix API rate limits, Synthetix service outages, or policies specific to your Synthetix account. Please contact your Synthetix Account Manager for such issues.

## Contributing

*(Optional: Add guidelines if you accept contributions)*
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://opensource.org/licenses/MIT) 