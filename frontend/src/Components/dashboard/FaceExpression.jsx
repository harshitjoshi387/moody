import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "./FaceExpression.css";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [expression, setExpression] = useState("Click Start");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );

        landmarkerRef.current = faceLandmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        detectLoop();
      } catch (error) {
        console.error(error);
        setExpression("Camera Error ❌");
      }
    };

    const detectLoop = () => {
      if (!isMounted) return;

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && landmarker && video.readyState === 4) {
        const results = landmarker.detectForVideo(
          video,
          performance.now()
        );

        if (results.faceBlendshapes?.length > 0) {
          const blendshapes = results.faceBlendshapes[0].categories;

          const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

          const smile =
            (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
          const jawOpen = getScore("jawOpen");
          const browDown =
            (getScore("browDownLeft") + getScore("browDownRight")) / 2;

          if (smile > 0.6) {
            setExpression("😊 Happy");
          } else if (jawOpen > 0.7) {
            setExpression("😮 Surprise");
          } else if (browDown > 0.6) {
            setExpression("😠 Angry");
          } else {
            setExpression("😐 Neutral");
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    if (isRunning) {
      initialize();
      document.documentElement.requestFullscreen(); // 🔥 true fullscreen
    }

    return () => {
      isMounted = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [isRunning]);

  return (
    <div className="app">
      <div className="header">
        <h1>Moody AI 🎭</h1>
        <button
          className="actionBtn"
          onClick={() => setIsRunning(true)}
        >
          Start Detection
        </button>
      </div>

      <div className="content">
        <div className="videoSection">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="video"
          />
        </div>

        <div className="infoSection">
          <h2>Detected Mood</h2>
          <div className="moodBadge">{expression}</div>
        </div>
      </div>
    </div>
  );
}