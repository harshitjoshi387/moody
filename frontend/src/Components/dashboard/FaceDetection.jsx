import { useState, useRef, useEffect } from "react";

export default function FaceDetection({ onClose, onFaceDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [detectionActive, setDetectionActive] = useState(false);
  const [faceCount, setFaceCount] = useState(0);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (detectionActive && cameraReady) {
      const interval = setInterval(() => {
        detectFace();
      }, 300);
      return () => clearInterval(interval);
    }
  }, [detectionActive, cameraReady]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Camera access denied. Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const detectFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    try {
      const response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 100,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: "image/jpeg",
                      data: canvas.toDataURL("image/jpeg", 0.7).split(",")[1],
                    },
                  },
                  {
                    type: "text",
                    text: "Count the number of faces in this image. Reply with ONLY a number (0-5). No text, no explanation.",
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const count = parseInt(data.content?.[0]?.text?.trim() || "0");
      if (!isNaN(count)) {
        setFaceCount(count);
      }
    } catch (err) {
      console.error("Face detection error:", err);
    }
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.80)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  };

  const modalStyle = {
    background: "#0f1117",
    borderRadius: "16px",
    padding: "1.25rem",
    width: "min(380px, 90vw)",
    border: "0.5px solid #2a2d3a",
    color: "white",
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", background: "#3b82f6", borderRadius: "50%", boxShadow: "0 0 6px #3b82f6" }}></div>
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>Face Scanner</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "20px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >×</button>
        </div>

        {/* Camera feed */}
        <div
          style={{
            background: "#1a1d2a",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "1rem",
            position: "relative",
            aspectRatio: "4/3",
            border: "1px solid #2a2d3a",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "scaleX(-1)",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Detection active indicator */}
          {detectionActive && cameraReady && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "11px",
                color: "#60a5fa",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#60a5fa",
                  animation: "pulse 1.5s infinite",
                }}
              />
              Detecting
            </div>
          )}

          {/* Face count badge */}
          {detectionActive && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(96, 165, 250, 0.3)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#60a5fa",
              }}
            >
              Faces: {faceCount}
            </div>
          )}

          {/* Loading state */}
          {!cameraReady && status === "idle" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#1a1d2a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#2a2d3a",
                  border: "1.5px solid #3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ color: "#6b7280", fontSize: "11px" }}>Requesting camera...</span>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#1a1d2a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "1rem",
              }}
            >
              <span style={{ fontSize: "24px" }}>📷</span>
              <span style={{ fontSize: "12px", color: "#f87171", textAlign: "center" }}>{errorMsg}</span>
              <button
                onClick={() => {
                  setStatus("idle");
                  startCamera();
                }}
                style={{
                  background: "#2a2d3a",
                  border: "none",
                  color: "#9ca3af",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "11px",
                  marginTop: "4px",
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setDetectionActive(!detectionActive)}
            disabled={!cameraReady || status === "error"}
            style={{
              flex: 1,
              background: detectionActive ? "#3b82f6" : "#2a2d3a",
              color: detectionActive ? "#fff" : "#6b7280",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: cameraReady ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {detectionActive ? "Stop Scan" : "Start Scan"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 0.6,
              background: "#1a1d2a",
              color: "#9ca3af",
              border: "1px solid #2a2d3a",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Close
          </button>
        </div>

        {/* Info text */}
        <div style={{ marginTop: "1rem", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
          Real-time face detection powered by AI
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
}
