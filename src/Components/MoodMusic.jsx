import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

function MoodMusic() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mood, setMood] = useState("Detecting...");

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks) return;

      const landmarks = results.multiFaceLandmarks[0];

      const upperLip = landmarks[13];
      const lowerLip = landmarks[14];

      const mouthOpenDistance = Math.abs(upperLip.y - lowerLip.y);

      if (mouthOpenDistance > 0.02) {
        setMood("😊 Happy");
      } else {
        setMood("😐 Neutral");
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  const getSongSuggestion = () => {
    if (mood.includes("Happy")) {
      return "🎵 Happy Playlist: Dance songs";
    } else {
      return "🎵 Chill Playlist: Soft songs";
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Mood: {mood}</h2>
      <h3>{getSongSuggestion()}</h3>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default MoodMusic;