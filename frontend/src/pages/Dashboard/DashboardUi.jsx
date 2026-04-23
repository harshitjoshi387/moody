import { useMemo, useState } from "react";
import FaceDetection from "../../components/dashboard/FaceDetection";
import { suggestSong } from "../../services/songService";
import "./Dashboard.css";

const moods = [
  {
    emoji: "Happy",
    name: "Happy",
    summary: "Upbeat tracks queued for you",
    confidence: 82,
  },
  {
    emoji: "Sad",
    name: "Sad",
    summary: "Comfort melodies loading for a softer mood",
    confidence: 74,
  },
  {
    emoji: "Angry",
    name: "Angry",
    summary: "High-energy songs ready to burn through the stress",
    confidence: 68,
  },
  {
    emoji: "Calm",
    name: "Calm",
    summary: "Chill songs selected for a slower, steadier vibe",
    confidence: 91,
  },
  {
    emoji: "Surprised",
    name: "Surprised",
    summary: "Fresh picks lined up for an unexpected mood swing",
    confidence: 77,
  },
];

function DashboardUi() {
  const [moodIndex, setMoodIndex] = useState(0);
  const [recommendedSong, setRecommendedSong] = useState(null);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [error, setError] = useState("");
  const [showFaceDetection, setShowFaceDetection] = useState(false);

  const currentMood = useMemo(() => moods[moodIndex], [moodIndex]);

  const handleSuggestSong = async () => {
    setIsLoadingSong(true);
    setError("");

    try {
      const song = await suggestSong(currentMood.name);
      setRecommendedSong(song);
    } catch (serviceError) {
      console.error(serviceError);
      setError("Could not fetch a song recommendation right now.");
    } finally {
      setIsLoadingSong(false);
    }
  };

  return (
    <section style={{ paddingBottom: "2rem" }}>
      {showFaceDetection && (
        <FaceDetection
          onClose={() => setShowFaceDetection(false)}
          onFaceDetected={() => setShowFaceDetection(false)}
        />
      )}

      <div className="hero">
        <div className="hero-blob hb1" />
        <div className="hero-blob hb2" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-dot" />
            <span className="badge-txt">Mood-based listening dashboard</span>
          </div>
          <h1>
            Music that follows
            <br />
            <span className="hl">your current mood.</span>
          </h1>
          <p className="hero-sub">
            Keep page-level UI in the page folder, shared UI in components, and
            API calls in services. This dashboard now follows that split.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleSuggestSong}>
              {isLoadingSong ? "Loading songs..." : "Get Song Suggestion"}
            </button>
            <button
              className="btn-face-detect"
              onClick={() => setShowFaceDetection(true)}
            >
              Scan Face
            </button>
            <button className="btn-ghost" onClick={() => setMoodIndex((moodIndex + 1) % moods.length)}>
              Switch Mood
            </button>
          </div>
        </div>
      </div>

      <div className="mood-strip">
        <div className="ms-emoji-big">{currentMood.emoji}</div>
        <div className="ms-left">
          <div>
            <div className="ms-label">Current mood</div>
            <div className="ms-mood">{currentMood.name}</div>
            <div className="ms-sub">{currentMood.summary}</div>
          </div>
        </div>
        <div className="ms-bar-wrap">
          <div className="ms-bar-label">
            <span>Confidence</span>
            <span>{currentMood.confidence}%</span>
          </div>
          <div className="ms-bar">
            <div
              className="ms-bar-fill"
              style={{ width: `${currentMood.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Suggested track</div>
          <span className="sec-link">{currentMood.name} mode</span>
        </div>

        <div className="album-row">
          <article className="album-card">
            <div className="alb-img ab1">
              <div className="alb-play">Play</div>
            </div>
            <div className="alb-name">
              {recommendedSong?.title || "Pick a track for this mood"}
            </div>
            <div className="alb-artist">
              {recommendedSong?.artist ||
                "The service response will appear here after fetching."}
            </div>
          </article>
        </div>

        {error ? <p style={{ marginTop: "1rem", color: "#fca5a5" }}>{error}</p> : null}
      </div>
    </section>
  );
}

export default DashboardUi;
