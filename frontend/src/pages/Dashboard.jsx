import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const moods = [
  { e: "😊", n: "Happy", s: "Upbeat tracks queued for you", c: 82, col: "#4ade80", track: "Tum Hi Ho", artist: "Arijit Singh" },
  { e: "😢", n: "Sad", s: "Comfort melodies loading...", c: 74, col: "#a78bfa", track: "Pal", artist: "KK" },
  { e: "😠", n: "Angry", s: "High energy — fire tracks incoming", c: 68, col: "#f87171", track: "Tattad Tattad", artist: "Vishal-Shekhar" },
  { e: "😌", n: "Calm", s: "Chill vibes — relax and breathe", c: 91, col: "#7dd3fc", track: "Lag Ja Gale", artist: "Lata Mangeshkar" },
  { e: "😮", n: "Surprised", s: "Party mode! Exciting picks for you", c: 77, col: "#fbbf24", track: "Gallan Goodiyaan", artist: "Shankar-Ehsaan-Loy" },
];

const artists = [
  { name: "Arijit Singh", sub: "With Sachin-Jigar, Jeet Gannguli, Pritam and...", color: "ac1", icon: "🎤" },
  { name: "KK", sub: "With Pritam, Roop Kumar Rathod, Anu Malik and...", color: "ac2", icon: "🎸" },
  { name: "A.R. Rahman", sub: "With Pritam, Hariharan, Unnikrishnan and more", color: "ac3", icon: "🎹" },
  { name: "Kishore Kumar", sub: "With Mukesh, Tabassum, Hemant Kumar and more", color: "ac4", icon: "🎙" },
  { name: "Shreya Ghoshal", sub: "With Arijit Singh, A.R. Rahman, Atif Aslam and...", color: "ac5", icon: "🎵" },
];

const albums = [
  { name: "Aashiqui 2", artist: "Various Artists", color: "ab1", icon: "🎬" },
  { name: "Do Patti", artist: "Sachin-Jigar", color: "ab2", icon: "🎭" },
  { name: "Sanam Teri Kasam", artist: "Himesh Reshammiya", color: "ab3", icon: "🌿" },
  { name: "Finding Her", artist: "Arijit Singh", color: "ab4", icon: "☁" },
  { name: "Raanjhanaa", artist: "A.R. Rahman", color: "ab5", icon: "🌊" },
  { name: "Dhara 420", artist: "Vishal-Shekhar", color: "ab6", icon: "✨" },
];

const moodPlaylists = [
  { emoji: "😊", name: "Happy Vibes", count: "42 tracks · 2h 18m", tag: "Pop · Dance · Bollywood", class: "mhappy" },
  { emoji: "😢", name: "Rainy Feels", count: "38 tracks · 2h 5m", tag: "Acoustic · Ghazal · Soft", class: "msad" },
  { emoji: "😠", name: "Fire Mode", count: "29 tracks · 1h 42m", tag: "Rock · Hip-Hop · EDM", class: "mangry" },
  { emoji: "😌", name: "Chill Zone", count: "55 tracks · 3h 10m", tag: "Lo-fi · Ambient · Indie", class: "mchill" },
];

export default function DashboardUI() {
  const navigate = useNavigate();
  const [moodIndex, setMoodIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

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

  return (
    <div style={{ paddingBottom: "72px" }}>

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
            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path d="M10 8l6 4-6 4V8z" fill="white" />
              </svg>
              Start Listening
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
          <div className="sec-title">Popular radio</div>
          <span className="sec-link">Show all</span>
        </div>
        <div className="artist-row">
          {artists.map((artist, i) => (
            <div className="artist-card" key={i}>
              <div className={`ac-img ${artist.color}`}>
                <span style={{ fontSize: "42px" }}>{artist.icon}</span>
                <div className="ac-badge" style={{ background: "rgba(0,0,0,.4)" }}>RADIO</div>
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
                <span>{album.icon}</span>
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

      {/* MOOD PLAYLISTS */}
      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Playlists for every mood</div>
          <span className="sec-link">Show all</span>
        </div>
        <div className="mood-grid">
          {moodPlaylists.map((mood, i) => (
            <div className={`mood-card ${mood.class}`} key={i}>
              <div className="mc-emoji">{mood.emoji}</div>
              <div className="mc-name">{mood.name}</div>
              <div className="mc-count">{mood.count}</div>
              <div className="mc-tag">{mood.tag}</div>
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