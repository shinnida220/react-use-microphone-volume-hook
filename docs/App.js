import "./App.css";
import { useEffect, useState } from "react";
import useMicrophoneVolume from "react-use-microphone-volume-hook";

function App() {
	const [volume, { startTrackingMicrophoneVolume, stopTrackingMicrophoneVolume }] = useMicrophoneVolume();
	const [isListening, setIsListening] = useState(false);

	function colorPids(vol) {
		const allPids = [...document.querySelectorAll(".pid")];
		const numberOfPidsToColor = Math.round(vol / 10);
		const pidsToColor = allPids.slice(0, numberOfPidsToColor);

		for (const pid of allPids) {
			pid.style.backgroundColor = "#e6e7e8";
		}
		for (const pid of pidsToColor) {
			pid.style.backgroundColor = "#69ce2b";
		}
	}

	const handleListening = (e) => {
		e.preventDefault();
		if (isListening) {
			disableListening();
		} else {
			enableListening();
		}
	};

	const enableListening = (e) => {
		const status = startTrackingMicrophoneVolume();
		if (status) setIsListening(true);
	};

	const disableListening = () => {
		const status = stopTrackingMicrophoneVolume();
		if (status) setIsListening(false);
	};

	useEffect(() => {
		console.log("Listening Changed", isListening);
	}, [isListening]);

	useEffect(() => {
		let isMounted = true;
		console.log("Volume Changed", volume);

		if (isMounted) {
			colorPids(volume);
		}

		return () => (isMounted = false);
	}, [volume]);

	return (
		<div className="App">
			<a
				href="#"
				onClick={handleListening}
				style={{ marginTop: 30, display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}
			>
				{isListening ? "Stop Tracking Volume" : "Start Tracking Volume"}
			</a>
			<div id="container" className="App-header">
				<div className="item">
					<img height={120} src={"/microphone.png" /**"https://www.kirupa.com/images/orange.png" **/} />
				</div>
				{volume > 0 && <div className="circle" style={{ animationDelay: "-1s" }}></div>}
				{volume > 0 && volume <= 50 && <div className="circle circle2" style={{ animationDelay: "-1s" }}></div>}
				{volume > 0 && volume <= 75 && <div className="circle circle3" style={{ animationDelay: "-1s" }}></div>}
				{volume > 0 && volume > 75 && <div className="circle circle4" style={{ animationDelay: "-1s" }}></div>}
			</div>

			<div className="pids-wrapper">
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
				<div className="pid"></div>
			</div>

			<div>Volume: {volume?.toFixed(2)}%</div>
		</div>
	);
}

export default App;
