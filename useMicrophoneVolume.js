import { useEffect, useState, useRef } from "react";

/**
 * setupMicrophonePermission async
 * Setup the necessary permission to be able to use the browser microphone
 *
 * @param {*} cb - callback to run after setting up thenecessary permissions
 */
async function setupMicrophonePermission(cb) {
	window?.navigator?.mediaDevices
		?.getUserMedia({ audio: true, video: false })
		.then((stream) => cb(null, stream))
		.catch((e) => {
			console.log("useMicrophone hook Error. Microphone permission failed", e);
			cb(true);
		});
}

/**
 * useMicrophoneVolume - A React hook to subscribe to microphone volume changes
 *
 * This hook can listen to changes in the browser microphone volume and return the current volume.
 * It triggers a permission intent so that the user can approve.
 * Tracking can be automatic or manually started.
 *
 */
const useMicrophoneVolume = (props) => {
	/** autostart default value */
	let { autoStart } = props || {};
	if (![true, false].includes(autoStart)) autoStart = false;

	const [microphoneVolume, setMicrophoneVolume] = useState(0);
	const [error, setError] = useState(false);
	const streamRef = useRef();

	const analyserRef = useRef();
	const microphoneRef = useRef();
	const scriptProcessorRef = useRef();

	/**
	 * startTrackingMicrophoneVolume
	 * Subscribe to browser volume changes
	 *
	 * @returns bool true|false
	 */
	const startTrackingMicrophoneVolume = () => {
		if (error) {
			console.warn("Possible permission error, ignoring request to startTracking ...");
			return false;
		}
		const audioContext = new AudioContext();
		analyserRef.current = audioContext.createAnalyser();
		microphoneRef.current = audioContext.createMediaStreamSource(streamRef.current);
		scriptProcessorRef.current = audioContext.createScriptProcessor(2048, 1, 1);
		analyserRef.current.smoothingTimeConstant = 0.8;
		analyserRef.current.fftSize = 1024;

		microphoneRef.current.connect(analyserRef.current);
		analyserRef.current.connect(scriptProcessorRef.current);

		scriptProcessorRef.current.connect(audioContext.destination);
		scriptProcessorRef.current.onaudioprocess = function () {
			const array = new Uint8Array(analyserRef.current.frequencyBinCount);
			analyserRef.current.getByteFrequencyData(array);
			const arraySum = array.reduce((a, value) => a + value, 0);
			const average = arraySum / array.length;
			setMicrophoneVolume(average);
		};

		return true;
	};

	/**
	 * stopTrackingMicrophoneVolume
	 * UnSubscribe to browser volume changes
	 *
	 * @returns bool true|false
	 */
	const stopTrackingMicrophoneVolume = () => {
		if (error) {
			console.warn("Possible permission error, ignoring request to stopTracking...");
			return false;
		}
		scriptProcessorRef.current?.disconnect();
		analyserRef.current?.disconnect();
		microphoneRef.current?.disconnect();
		setMicrophoneVolume(0);
		return true;
	};

	/**
	 * setup listeners
	 */
	useEffect(() => {
		window.addEventListener(
			"DOMContentLoaded",
			setupMicrophonePermission((error, stream) => {
				if (!error) {
					streamRef.current = stream;
					if (autoStart) startTrackingMicrophoneVolume();
				} else {
					setError(true);
				}
			})
		);
		return () => {
			streamRef.current = null;
			window.removeEventListener("DOMContentLoaded", setupMicrophonePermission);
		};
	}, [autoStart]);

	return [microphoneVolume, { startTrackingMicrophoneVolume, stopTrackingMicrophoneVolume }];
};

export default useMicrophoneVolume;
