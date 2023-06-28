# Synthetix Transcript Downloader (Unofficial)

Synthetix Transcript Downloader is an unofficial application that allows you to fetch and save chat transcripts from the Synthetix platform.

![Main Window](./Screenshots/main.png)

## Installation

You can install the application by following these steps:

1. Download the installation file from the [Installer](./Installer/setup.exe) directory.
2. Run the setup.exe file.
3. Follow the on-screen instructions to complete the installation process.

## Usage

1. Launch the Synthetix Transcript Downloader application.
2. Enter your Synthetix credentials and API keys in the Settings tab. (Note that you should use a service account otherwise, you will need to login on the console first to avoid MFA. Speak to your account manager about getting a service account)
3. Click the "Save" button to save your settings.
4. Click the "Login & Get Transcripts" button to log in and fetch the chat IDs.
5. The chat IDs will be displayed in the log window.
6. The application will automatically download and save the transcripts for each chat ID.
7. The saved transcripts will be stored in the specified output path.

![Settings Window](./Screenshots/settings.png)

## Configuration

The application uses a settings file (settings.json) to store your configuration. You can find this file in the same directory as the executable. You can modify the settings directly by opening the file in a text editor.

## Contributing

Contributions are welcome! If you have any bug reports, feature requests, or code improvements, feel free to open an issue or submit a pull request.

## Disclaimer

This application is not affiliated with or endorsed by Synthetix. It is an unofficial tool developed by [HairyDuck] for personal use.

## License

This project is licensed under the [MIT License](./LICENSE).
