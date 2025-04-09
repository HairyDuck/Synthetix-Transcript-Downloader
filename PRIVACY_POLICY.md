# Privacy Policy for Synthetix Transcript Downloader (Unofficial)

*Last Updated: April 9, 2025*

This Privacy Policy describes how the "Synthetix Transcript Downloader (Unofficial)" Chrome Extension (referred to as "the Extension") handles your information.

**Important Disclaimer:** This is an unofficial Chrome extension and is **not** created, affiliated with, maintained, supported, sponsored, or endorsed by [Synthetix](https://www.synthetix.com/).

## Information We Collect (and Store Locally)

This extension needs to store certain information locally on your computer using the secure Chrome Storage API (`chrome.storage.local`) to function. This information includes:

*   **API Credentials:** Synthetix Application Key, Synthetix Consumer Key.
*   **Service Account Credentials:** Synthetix Service Account Username, Synthetix Service Account Password.
*   **Configuration Settings:** Selected API Environment (e.g., Production, Sandbox), the choice to save downloads to a subfolder (`SynthetixTranscripts/`), and whether the initial instructions page has been viewed.

## How We Use Your Information

The information stored locally by this extension is used **solely** for the following purposes initiated by you within the Extension:

*   To authenticate your requests with the specific Synthetix API endpoint (Production, Staging, or Sandbox) that you have configured in the extension's settings.
*   To retrieve chat IDs and transcript details from the Synthetix API based on the date range you select.
*   To facilitate the download of transcript files to your computer via the `chrome.downloads` API.
*   To remember your settings preferences between browser sessions.

## Data Storage and Transmission

All the credentials and settings listed above are stored **only** on your local computer within the Chrome browser's secure storage area for this specific extension.

This data is **NOT** transmitted to, collected by, or stored on any servers operated by the developer of this Extension. We do not have access to your credentials or downloaded transcripts.

The only external transmission of your credentials occurs when the Extension makes direct API calls from your browser to the Synthetix API endpoints (e.g., `api.synthetix.com`, `apisandbox.synthetix.com`) that you have selected in the settings, as required for the Extension to perform its function (testing connection, downloading transcripts).

## Third-Party Services

This Extension interacts directly with the Synthetix API based on your configuration. Your interaction with the Synthetix API is subject to [Synthetix's own terms of service and privacy policies](https://www.synthetix.com/).

This Extension does not integrate with any other third-party services for tracking, analytics, or advertising.

## Security

While credentials are stored locally using Chrome's storage mechanisms, it is your responsibility to ensure the security of your computer and browser. We recommend using strong, unique passwords for your Synthetix Service Account.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy within the extension's repository or store listing. You are advised to review this Privacy Policy periodically for any changes.

## Contact Us

If you have questions about this Privacy Policy, please contact: [synthetix_transcript_downloader@lukedev.co.uk](mailto:synthetix_transcript_downloader@lukedev.co.uk) 