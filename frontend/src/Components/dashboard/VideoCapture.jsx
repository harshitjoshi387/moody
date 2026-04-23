import { useEffect, useRef, useState } from "react";
import {
  createEmotionDetector,
  detectEmotionFromVideo,
  startVideoStream,
  stopVideoStream,
} from "../../utils/emotionDetector";

function VideoCapture() {
  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const frameRef = useRef(null);

  const [expression, setExpression] = useState("Click Start");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    let isMounted = true;

    const detectLoop = () => {
      if (!isMounted) {
        return;
      }

      const nextExpression = detectEmotionFromVideo(
        detectorRef.current,
        videoRef.current
      );

      if (nextExpression) {
        setExpression(nextExpression);
      }

      frameRef.current = requestAnimationFrame(detectLoop);
    };

    const initializeDetection = async () => {
      try {
        setError("");
        detectorRef.current = await createEmotionDetector();
        await startVideoStream(videoRef.current);
        detectLoop();
      } catch (initializationError) {
        console.error(initializationError);
        setError("Unable to access the camera or emotion detector.");
        setExpression("Camera Error");
        setIsRunning(false);
      }
    };

    initializeDetection();

    return () => {
      isMounted = false;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      stopVideoStream(videoRef.current);
      detectorRef.current?.close?.();
      detectorRef.current = null;
    };
  }, [isRunning]);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
        gap: "1.5rem",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          minHeight: "420px",
          borderRadius: "24px",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          borderRadius: "24px",
          padding: "1.5rem",
          background: "rgba(7, 15, 37, 0.72)",
          border: "1px solid rgba(143, 179, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#8fb3ff",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.8rem",
            }}
          >
            Live Analysis
          </p>
          <h2 style={{ marginBottom: "0.5rem" }}>Detected Mood</h2>
          <div
            style={{
              padding: "1rem",
              borderRadius: "18px",
              background: "rgba(255, 255, 255, 0.92)",
              color: "#10203d",
              fontSize: "1.3rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {expression}
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "999px",
              padding: "0.95rem 1.1rem",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#fff",
              cursor: isRunning ? "not-allowed" : "pointer",
              background: isRunning
                ? "rgba(255, 255, 255, 0.18)"
                : "linear-gradient(90deg, #4f8cff, #78c4ff)",
            }}
          >
            {isRunning ? "Detection Running" : "Start Detection"}
          </button>

          {error ? (
            <p style={{ marginTop: "0.75rem", color: "#ffb4b4" }}>{error}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default VideoCapture;
