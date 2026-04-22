import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import FaceDetection from "../components/FaceDetection";
import { suggestSong } from "../services/song.api";

const moods = [
  { e: "😊", n: "Happy", s: "Upbeat tracks queued for you", c: 82, col: "#4ade80", track: "Tum Hi Ho", artist: "Arijit Singh" },
  { e: "😢", n: "Sad", s: "Comfort melodies loading...", c: 74, col: "#a78bfa", track: "Pal", artist: "KK" },
  { e: "😠", n: "Angry", s: "High energy — fire tracks incoming", c: 68, col: "#f87171", track: "Tattad Tattad", artist: "Vishal-Shekhar" },
  { e: "😌", n: "Calm", s: "Chill vibes — relax and breathe", c: 91, col: "#7dd3fc", track: "Lag Ja Gale", artist: "Lata Mangeshkar" },
  { e: "😮", n: "Surprised", s: "Party mode! Exciting picks for you", c: 77, col: "#fbbf24", track: "Gallan Goodiyaan", artist: "Shankar-Ehsaan-Loy" },
];

const artists = [
  { name: "Arijit Singh", sub: "With Sachin-Jigar, Jeet Gannguli, Pritam and...", color: "ac1", icon: "🎤", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
  { name: "KK", sub: "With Pritam, Roop Kumar Rathod, Anu Malik and...", color: "ac2", icon: "🎸", img: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop" },
  { name: "A.R. Rahman", sub: "With Pritam, Hariharan, Unnikrishnan and more", color: "ac3", icon: "🎹", img: "https://images.unsplash.com/photo-1540359330-c10b2764f8a0?w=300&h=300&fit=crop" },
  { name: "Kishore Kumar", sub: "With Mukesh, Tabassum, Hemant Kumar and more", color: "ac4", icon: "🎙", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
  { name: "Shreya Ghoshal", sub: "With Arijit Singh, A.R. Rahman, Atif Aslam and...", color: "ac5", icon: "🎵", img: "https://images.unsplash.com/photo-1504003386042-92f0ba3fad9d?w=300&h=300&fit=crop" },
  { name: "Yo Yo Honey Singh", sub: "Hip-hop, Rap, Bollywood Music", color: "ac1", img: "https://images.unsplash.com/photo-1516280318271-e6e17fb8fb51?w=300&h=300&fit=crop" },
  { name: "Udit Narayan", sub: "Playback Singer, Film Music", color: "ac2", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop" },
  { name: "Atif Aslam", sub: "Ghazals, Bollywood, Pakistani Music", color: "ac3", img: "https://images.unsplash.com/photo-1498038432885-52b235277a89?w=300&h=300&fit=crop" },
];

const albums = [
  { name: "Aashiqui 2", artist: "Various Artists", color: "ab1", icon: "🎬", img: "https://images.unsplash.com/photo-1513382035-8e4c9cd1dd35?w=200&h=200&fit=crop" },
  { name: "Do Patti", artist: "Sachin-Jigar", color: "ab2", icon: "🎭", img: "https://images.unsplash.com/photo-1490225008023-456e114dd329?w=200&h=200&fit=crop" },
  { name: "Sanam Teri Kasam", artist: "Himesh Reshammiya", color: "ab3", icon: "🌿", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop" },
  { name: "Finding Her", artist: "Arijit Singh", color: "ab4", icon: "☁", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=200&fit=crop" },
  { name: "Raanjhanaa", artist: "A.R. Rahman", color: "ab5", icon: "🌊", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop" },
  { name: "Ultimate Love Songs", artist: "Arijit Singh", color: "ab6", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
];



/* ─────────────────────────────────────────
   FACE MOOD SCANNER MODAL (fully integrated)
───────────────────────────────────────── */
function FaceMoodScanner({ onClose, onMoodDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | scanning | result | error
  const [result, setResult] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Camera access denied. Please allow camera in browser settings.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  };

  const detectMood = async () => {
    setStatus("scanning");
    const imageData = captureFrame();
    if (!imageData) {
      setStatus("error");
      setErrorMsg("Could not capture frame. Try again.");
      return;
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
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
                  source: { type: "base64", media_type: "image/jpeg", data: imageData },
                },
                {
                  type: "text",
                  text: `Analyze this face image and detect the person's emotional mood.
Reply ONLY with a valid JSON object — no extra text, no markdown:
{"mood": "Happy", "confidence": 87, "moodIndex": 0}

Rules:
- mood must be exactly one of: Happy, Sad, Angry, Calm, Surprised
- moodIndex mapping: Happy=0, Sad=1, Angry=2, Calm=3, Surprised=4
- confidence is a number 1-100
- If no face detected, pick Calm with confidence 50`,
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setStatus("result");
    } catch (err) {
      setStatus("error");
      setErrorMsg("AI detection failed. Please try again.");
    }
  };

  const moodEmojis = ["😊", "😢", "😠", "😌", "😮"];
  const moodColors = ["#4ade80", "#a78bfa", "#f87171", "#7dd3fc", "#fbbf24"];

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
    borderRadius: "20px",
    padding: "1.5rem",
    width: "min(460px, 92vw)",
    border: "0.5px solid #2a2d3a",
    color: "white",
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%", boxShadow: "0 0 6px #4ade80" }}></div>
            <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>AI Mood Scanner</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: "22px", cursor: "pointer", lineHeight: 1, padding: "0 4px" }}
          >×</button>
        </div>

        {/* Camera feed */}
        <div style={{
          background: "#1a1d2a",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.25rem",
          position: "relative",
          aspectRatio: "4/3",
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scaleX(-1)" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Corner brackets */}
          {[
            { top: "10px", left: "10px", borderTop: "2px solid #4ade80", borderLeft: "2px solid #4ade80", borderRadius: "3px 0 0 0" },
            { top: "10px", right: "10px", borderTop: "2px solid #4ade80", borderRight: "2px solid #4ade80", borderRadius: "0 3px 0 0" },
            { bottom: "10px", left: "10px", borderBottom: "2px solid #4ade80", borderLeft: "2px solid #4ade80", borderRadius: "0 0 0 3px" },
            { bottom: "10px", right: "10px", borderBottom: "2px solid #4ade80", borderRight: "2px solid #4ade80", borderRadius: "0 0 3px 0" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: "20px", height: "20px", ...s }} />
          ))}

          {/* Scanning overlay */}
          {status === "scanning" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(74,222,128,0.08)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                border: "2px solid transparent",
                borderTop: "2px solid #4ade80",
                animation: "spin 0.8s linear infinite"
              }} />
              <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: 500 }}>Analyzing your face...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error overlay */}
          {status === "error" && (
            <div style={{
              position: "absolute", inset: 0, background: "#1a1d2a",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "8px", padding: "1rem"
            }}>
              <span style={{ fontSize: "28px" }}>📷</span>
              <span style={{ fontSize: "13px", color: "#f87171", textAlign: "center" }}>{errorMsg}</span>
              <button
                onClick={() => { setStatus("idle"); startCamera(); }}
                style={{ background: "#2a2d3a", border: "none", color: "#9ca3af", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "12px" }}
              >Try Again</button>
            </div>
          )}

          {/* No camera yet */}
          {!cameraReady && status === "idle" && (
            <div style={{
              position: "absolute", inset: 0, background: "#1a1d2a",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#2a2d3a", border: "1.5px solid #4ade80",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#4ade80" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>Requesting camera access...</span>
            </div>
          )}
        </div>

        {/* Result card */}
        {status === "result" && result && (
          <div style={{
            background: "#1a1d2a", borderRadius: "12px",
            padding: "14px", marginBottom: "1rem",
            display: "flex", alignItems: "center", gap: "12px",
            border: `1px solid ${moodColors[result.moodIndex]}33`
          }}>
            <span style={{ fontSize: "32px", lineHeight: 1 }}>{moodEmojis[result.moodIndex]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px" }}>Detected mood</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: moodColors[result.moodIndex] }}>{result.mood}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>Confidence</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "white" }}>{result.confidence}%</div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        {status === "result" && result ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => { setResult(null); setStatus("idle"); }}
              style={{
                flex: 1, background: "#1a1d2a", color: "#9ca3af",
                border: "0.5px solid #2a2d3a", borderRadius: "10px",
                padding: "11px", fontSize: "13px", fontWeight: 500, cursor: "pointer"
              }}
            >Scan Again</button>
            <button
              onClick={() => onMoodDetected(result.moodIndex)}
              style={{
                flex: 2, background: "#4ade80", color: "#000",
                border: "none", borderRadius: "10px",
                padding: "11px", fontSize: "14px", fontWeight: 700, cursor: "pointer"
              }}
            >Apply & Play Songs ▶</button>
          </div>
        ) : (
          <button
            onClick={detectMood}
            disabled={!cameraReady || status === "scanning" || status === "error"}
            style={{
              width: "100%",
              background: (cameraReady && status !== "scanning" && status !== "error") ? "#4ade80" : "#2a2d3a",
              color: (cameraReady && status !== "scanning" && status !== "error") ? "#000" : "#6b7280",
              border: "none", borderRadius: "10px",
              padding: "12px", fontSize: "14px", fontWeight: 700,
              cursor: (cameraReady && status !== "scanning") ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            {status === "scanning" ? "Scanning..." : "Scan My Mood"}
          </button>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
export default function DashboardUI() {
  const navigate = useNavigate();
  const [moodIndex, setMoodIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [showScanner, setShowScanner] = useState(false);
  const [showFaceDetection, setShowFaceDetection] = useState(false);

  const currentMood = moods[moodIndex];

  const cycleMood = () => {
    setMoodIndex((prev) => (prev + 1) % moods.length);
  };

  const togglePlay = () => {
    if (!playing) {
      setPlaying(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPlaying(false);
            return 100;
          }
          return prev + 0.3;
        });
      }, 200);
    } else {
      setPlaying(false);
    }
  };

  const handleMoodDetected = async (idx) => {
    setMoodIndex(idx);
    setShowScanner(false);
    setProgress(0);
    setPlaying(false);

    try {
      const mood = moods[idx].n; // Get mood name (e.g., Happy, Sad)
      const song = await suggestSong(mood); // Fetch song from backend
      console.log("Suggested Song:", song); // Replace with actual song playback logic
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };

  return (
    <div style={{ paddingBottom: "72px" }}>

      {/* Face Detection Modal */}
      {showFaceDetection && (
        <FaceDetection
          onClose={() => setShowFaceDetection(false)}
          onFaceDetected={() => setShowFaceDetection(false)}
        />
      )}

      {/* Face Mood Scanner Modal */}
      {showScanner && (
        <FaceMoodScanner
          onClose={() => setShowScanner(false)}
          onMoodDetected={handleMoodDetected}
        />
      )}

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="logo-name">Mood<span>ify</span></div>
        </div>
        <div className="nav-links">
          <div className="nl active">Home</div>
          <div className="nl">Discover</div>
          <div className="nl">Library</div>
          <div className="nl">Playlists</div>
          <div className="nl">Analytics</div>
        </div>
        <div className="nav-right">
          <div className="user-chip">
            <div className="uavatar">H</div>
            <div className="uname">user1</div>
          </div>
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-blob hb1"></div>
        <div className="hero-blob hb2"></div>
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-dot"></div>
            <span className="badge-txt">AI Emotion Detection — Active</span>
          </div>
          <h1>Music that matches<br /><span className="hl">your mood, live.</span></h1>
          <p className="hero-sub">Moodify reads your emotions in real time using your camera and curates the perfect playlist — powered by Spotify and AI.</p>
          <div className="hero-actions">
            {/* 👇 FACE SCAN BUTTON */}
            <button className="btn-primary" onClick={() => setShowScanner(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Scan My Mood
            </button>
            {/* Face Detection Button */}
            <button className="btn-face-detect" onClick={() => setShowFaceDetection(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                <path d="M9 15c1 1 3 1 3 1s2 0 3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="btn-ghost">How it works →</button>
          </div>
        </div>
      </div>

      {/* LIVE MOOD STRIP */}
      <div className="mood-strip">
        <div className="ms-emoji-big">{currentMood.e}</div>
        <div className="ms-left">
          <div>
            <div className="ms-label">Live Analysis</div>
            <div className="ms-mood" style={{ color: currentMood.col }}>{currentMood.n}</div>
            <div className="ms-sub">{currentMood.s}</div>
          </div>
        </div>
        <div className="ms-bar-wrap">
          <div className="ms-bar-label">
            <span>Confidence</span>
            <span>{currentMood.c}%</span>
          </div>
          <div className="ms-bar">
            <div className="ms-bar-fill" style={{ width: `${currentMood.c}%` }}></div>
          </div>
        </div>
        <button className="ms-btn" onClick={cycleMood}>Detect Mood</button>
      </div>

      {/* POPULAR ARTISTS */}
      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Popular artists</div>
          <span className="sec-link">Show all</span>
        </div>
        <div className="artist-row">
          {artists.map((artist, i) => (
            <div className="artist-card" key={i}>
              <div className="ac-img-circular">
                {artist.img ? (
                  <img src={artist.img} alt={artist.name} className="ac-img-photo" />
                ) : (
                  <span style={{ fontSize: "42px" }}>{artist.icon}</span>
                )}
              </div>
              <div className="ac-name">{artist.name}</div>
              <div className="ac-sub">{artist.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POPULAR ALBUMS */}
      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Popular albums and singles</div>
          <span className="sec-link">Show all</span>
        </div>
        <div className="album-row">
          {albums.map((album, i) => (
            <div className="album-card" key={i}>
              <div className={`alb-img ${album.color}`}>
                {album.img ? (
                  <img src={album.img} alt={album.name} className="alb-img-photo" />
                ) : (
                  <span>{album.icon}</span>
                )}
                <div className="alb-play">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="#000">
                    <path d="M1 1l10 6-10 6z" />
                  </svg>
                </div>
              </div>
              <div className="alb-name">{album.name}</div>
              <div className="alb-artist">{album.artist}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MINI PLAYER */}
      <div className="player">
        <div className="pl-track">
          <div className="pl-art">🎵</div>
          <div className="pl-info">
            <div className="pl-name">{currentMood.track}</div>
            <div className="pl-artist">{currentMood.artist}</div>
          </div>
          <div className="pl-heart">♥</div>
        </div>
        <div className="pl-center">
          <div className="pl-controls">
            <div className="pl-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 1l-10 11 10 11M7 1l-5 11 5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 20L9 12l10-8v16zM5 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pl-play" onClick={togglePlay}>
              {playing ? (
                <svg width="14" height="16" viewBox="0 0 14 16" fill="#000">
                  <rect x="0" y="0" width="4" height="16" fill="#000" />
                  <rect x="8" y="0" width="4" height="16" fill="#000" />
                </svg>
              ) : (
                <svg width="14" height="16" viewBox="0 0 14 16" fill="#000">
                  <path d="M0 0l14 8L0 16z" />
                </svg>
              )}
            </div>
            <div className="pl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 4l10 8-10 8V4zM19 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pl-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 1l4 4-4 4M3 7V5a2 2 0 012-2h11M7 23l-4-4 4-4M21 17v2a2 2 0 01-2 2H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="pl-prog">
            <span className="pl-time">1:24</span>
            <div className="pl-bar">
              <div className="pl-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="pl-time" style={{ textAlign: "right" }}>4:22</span>
          </div>
        </div>
        <div className="pl-right">
          <div className="pl-mood-pill">
            <div className="badge-dot" style={{ width: "6px", height: "6px" }}></div>
            <span>{currentMood.n}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="#5a6a7a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 18v-6a9 9 0 0118 0v6" stroke="#5a6a7a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke="#5a6a7a" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

    </div>
  );
}
