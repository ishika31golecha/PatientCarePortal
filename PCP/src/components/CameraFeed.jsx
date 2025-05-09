import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [alerts, setAlerts] = useState([]); // Stores multiple notifications

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing webcam:", error));

    // Run detection every 2 seconds
    const interval = setInterval(() => {
      detectRedLightAndNumber();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const detectRedLightAndNumber = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let redDetected = false;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > 200 && g < 100 && b < 100) { // Detect red light
        redDetected = true;
        break;
      }
    }

    if (redDetected) {
      console.log("🚨 Red light detected! Extracting registration number...");
      extractNumberFromVideo();
    }
  };

  const extractNumberFromVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    Tesseract.recognize(
      canvas,
      "eng",
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log("OCR Result:", text);
      const numberMatch = text.match(/\d+/g); // Extract multiple numbers

      if (numberMatch) {
        numberMatch.forEach((registrationNumber) => {
          addAlert(registrationNumber);
        });
      }
    });
  };

  const addAlert = (registrationNumber) => {
    setAlerts((prevAlerts) => {
      // Avoid duplicate notifications
      if (!prevAlerts.some(alert => alert.number === registrationNumber)) {
        return [...prevAlerts, { number: registrationNumber, timestamp: Date.now() }];
      }
      return prevAlerts;
    });
  };

  const resolveAlert = (number) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.number !== number));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Camera Monitoring & Alerts</h1>
      <video ref={videoRef} autoPlay className="w-64 h-48 border mt-6" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 space-y-2">
        {alerts.map((alert) => (
          <div key={alert.number} className="bg-[#72C6EB] text-black p-4 rounded font-semibold flex items-center justify-between w-96">
            <span>Patient - Registration No {alert.number} needs help!</span>
            <button
              onClick={() => resolveAlert(alert.number)}
              className="ml-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Resolve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeed;
