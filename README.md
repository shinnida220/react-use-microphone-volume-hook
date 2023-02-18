# Welcome to react-use-microphone-volume-hook 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)

> A React hook to subscribe to microphone volume changes

### 🏠 [Homepage](https://github.com/shinnida220/react-use-microphone-volume-hook)

### ✨ [Demo](https://react-use-microphone-volume-demo.surge.sh)

## Install

```sh
yarn install react-use-microphone-volume-hook
npm install react-use-microphone-volume-hook
```

## Usage (Snippet)

```javascript
"use strict";

import useMicrophoneVolume from "react-use-microphone-volume-hook";

// use hook with manual volume tracking
const [volume, { startTrackingMicrophoneVolume, stopTrackingMicrophoneVolume }] = useMicrophoneVolume();

// use hook with auto volume tracking
const [volume, { startTrackingMicrophoneVolume, stopTrackingMicrophoneVolume }] = useMicrophoneVolume({ autoStart: true });

// stop volume tracking
stopTrackingMicrophoneVolume(); // returns true on success, false on error

// manually start volume tracking
startTrackingMicrophoneVolume(); // returns true on success, false on error

// use volume
<div>Volume: {volume} </div>;
```

Please check here for a sample usage
<a name="docs/App.js"></a>

## Author

👤 **Emmanuel Ibikunle**

- Github: [@shinnida220](https://github.com/shinnida220)
- LinkedIn: [@nuelibikunle](https://linkedin.com/in/nuelibikunle)

## Show your support

Give a ⭐️ if this project helped you!

<!-- LICENSE Start -->

<a name="license"></a>

## License

This software is released under the [MIT License].
