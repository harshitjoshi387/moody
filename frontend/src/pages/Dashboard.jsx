import { useState } from "react";
import "./dashboard.css";

export default function DashboardUI() {
  const moods = [
    { e: "😊", n: "Happy", s: "Upbeat tracks queued for you", c: 82, col: "#4ade80" },
    { e: "😢", n: "Sad", s: "Comfort melodies loading...", c: 74, col: "#a78bfa" },
    { e: "😠", n: "Angry", s: "Fire tracks incoming", c: 68, col: "#f87171" },
    { e: "😌", n: "Calm", s: "Chill vibes", c: 91, col: "#7dd3fc" },
  ];

  const [i, setI] = useState(0);
  const m = moods[i];

  return (
    <div style={{ paddingBottom: "72px" }}>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-dot"></div>
            <span className="badge-txt">AI Emotion Detection — Active</span>
          </div>

          <h1>
            Music that matches <br />
            your <span className="hl">mood, live.</span>
          </h1>

          <p className="hero-sub">
            Moodify reads your emotions and plays music accordingly
          </p>

          <div className="hero-actions">
            <button className="btn-primary">Start Listening</button>
            <button className="btn-ghost">How it works →</button>
          </div>
        </div>
      </div>

      {/* MOOD STRIP */}
      <div className="mood-strip">
        <div className="ms-emoji-big">{m.e}</div>

        <div className="ms-left">
          <div>
            <div className="ms-label">Live Analysis</div>
            <div className="ms-mood" style={{ color: m.col }}>
              {m.n}
            </div>
            <div className="ms-sub">{m.s}</div>
          </div>
        </div>

        <div className="ms-bar-wrap">
          <div className="ms-bar-label">
            <span>Confidence</span>
            <span>{m.c}%</span>
          </div>
          <div className="ms-bar">
            <div
              className="ms-bar-fill"
              style={{ width: m.c + "%" }}
            ></div>
          </div>
        </div>

        <button
          className="ms-btn"
          onClick={() => setI((prev) => (prev + 1) % moods.length)}
        >
          Detect Mood
        </button>
      </div>

      {/* PLAYLIST SECTION (same UI) */}
      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Playlists for every mood</div>
        </div>

        <div className="mood-grid">
          <div className="mood-card mhappy">
            <div className="mc-emoji">😊</div>
            <div className="mc-name">Happy Vibes</div>
          </div>

          <div className="mood-card msad">
            <div className="mc-emoji">😢</div>
            <div className="mc-name">Sad Feels</div>
          </div>

          <div className="mood-card mangry">
            <div className="mc-emoji">😠</div>
            <div className="mc-name">Fire Mode</div>
          </div>

          <div className="mood-card mchill">
            <div className="mc-emoji">😌</div>
            <div className="mc-name">Chill Zone</div>
          </div>
        </div>
      </div>

    </div>
  );
}