# IPTV WEB Player

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue?style=flat-square)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen?style=flat-square)]()
[![Responsive](https://img.shields.io/badge/Responsive-Yes-blue?style=flat-square)]()
[![Multi-Platform](https://img.shields.io/badge/Multi--Platform-Yes-blueviolet?style=flat-square)]()
[![Web App](https://img.shields.io/badge/Web%20App-Yes-orange?style=flat-square)]()

**IPTV WEB Player** is a professional, responsive web streaming application developed by **Bocaletto Luca**. It allows users to upload an .m3u or .m3u8 playlist file to dynamically generate a channel list and stream IPTV channels using HLS.js. The app features a modern, icon-enhanced UI with full keyboard and gamepad support for seamless navigation.

## Features

- **Playlist Upload:** Easily upload your .m3u or .m3u8 playlist to load IPTV channels.
- **Dynamic Channel List:** Automatically parse and display channels from your playlist.
- **HLS Streaming:** Seamless streaming powered by [HLS.js](https://cdn.jsdelivr.net/npm/hls.js@latest).
- **Responsive, Modern UI:** Beautiful design with professional icons and smooth animations.
- **Universal Input Support:** 
  - **Keyboard Controls:**  
    • **L key:** Open the file input to load a new playlist  
    • **Arrow Up/Down:** Navigate the channel list  
    • **Enter:** Select the highlighted channel  
    • **Space:** Toggle play/pause  
    • **‘+’ / ‘=’ and ‘-’:** Adjust volume  
    • **M key:** Toggle mute  
    • **F key:** Toggle fullscreen  
    • **P key:** Toggle Picture-in-Picture  
  - **Gamepad Controls:**  
    • **D-Pad Up/Down:** Navigate the channel list  
    • **A Button:** Select the channel  
    • **B Button:** Toggle play/pause  
    • **LT / RT:** Volume down/up  
    • **X Button:** Toggle mute  
    • **Y Button:** Toggle fullscreen  
    • **LB:** Trigger file input  
    • **Back Button:** Toggle Picture-in-Picture  
- **Visual Feedback:** A spinner overlay is displayed during stream loading.

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **[HLS.js](https://cdn.jsdelivr.net/npm/hls.js@latest)**

## Installation

1. Clone the repository:
git clone https://github.com/bocaletto-luca/IPTV-WEB-Player-JS.git

2. Navigate to the project directory:
cd IPTV-WEB-Player

3. Open the `index.html` file in your web browser or run a local web server for full functionality.

## Usage

1. **Upload Playlist:**  
   Click the file input (or press the **L key** or **LB button** on your gamepad) to select your .m3u or .m3u8 playlist containing IPTV channel links.
2. **Select Channel:**  
   The app will parse your playlist and dynamically generate a channel list. Use the mouse, keyboard (Arrow keys and Enter), or gamepad (D-Pad and A button) to navigate and select a channel.
3. **Stream Video:**  
   Once a channel is selected, the stream loads via HLS.js. Use on-screen controls or input devices (e.g., Space for pause/resume, volume keys, M for mute, F for fullscreen, P for Picture-in-Picture) to control playback.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix:

git checkout -b feature/your-feature-name

3. Commit your changes with clear messages:
git commit -m "Describe your change"

4. Push your branch:
git push origin feature/your-feature-name

5. Open a pull request detailing your changes.

## License

This project is licensed under the GPLv3 License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please contact **Bocaletto Luca**.
