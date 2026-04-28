import React, { useState } from "react";
import "../App.css";

const sidebarArtists = [
  { name: "Lumen Bay", img: "https://i.pravatar.cc/40?img=1" },
  { name: "Maya Solis", img: "https://i.pravatar.cc/40?img=5" },
  { name: "Eli North", img: "https://i.pravatar.cc/40?img=8" },
  { name: "RØNIN", img: "https://i.pravatar.cc/40?img=12" },
  { name: "Soft Static", img: "https://i.pravatar.cc/40?img=15" },
];

const dailyMixes = [
  {
    id: 1,
    title: "Daily Mix 01",
    subtitle: "Maya Solis, Lumen Bay & ...",
    bg: "#2a2a2a",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&grayscale",
  },
  {
    id: 2,
    title: "Daily Mix 02",
    subtitle: "Eli North, Nina Vale & mo...",
    bg: "#1a0a2e",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Daily Mix 03",
    subtitle: "RØNIN, Voltage Kids & m...",
    bg: "#3d1a00",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Daily Mix 04",
    subtitle: "Soft Static, Kazu & more",
    bg: "#2d0a0a",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Daily Mix 05",
    subtitle: "Atlas Mind, Echo Library",
    bg: "#1a1a1a",
    img: "https://images.unsplash.com/photo-1511735111819-9a3efd16269e?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    title: "Daily Mix 06",
    subtitle: "Riley Maren, Hale & Co",
    bg: "#0a1a2d",
    img: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=200&h=200&fit=crop",
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("mood");
  const [libraryTab, setLibraryTab] = useState("playlists");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  return (
    <div className="app-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Logo */}
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#1ed760" />
              <path d="M8 11c3-1.5 9-1.5 12 0M7 15c4-2 10-2 14 0M9 19c2.5-1 7.5-1 10 0" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="logo-text">Moodify</span>
          </div>

          {/* Nav */}
          <nav className="main-nav">
            <button
              className={`nav-item ${activeNav === "home" ? "active" : ""}`}
              onClick={() => setActiveNav("home")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Home</span>
            </button>
            <button
              className={`nav-item ${activeNav === "search" ? "active" : ""}`}
              onClick={() => setActiveNav("search")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span>Search</span>
            </button>
            <button
              className={`nav-item mood-nav ${activeNav === "mood" ? "active" : ""}`}
              onClick={() => setActiveNav("mood")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Mood Scanner</span>
            </button>
          </nav>
        </div>

        {/* Library */}
        <div className="library">
          <div className="library-header">
            <div className="library-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
              </svg>
              <span>Your Library</span>
            </div>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </button>
          </div>

          <div className="library-tabs">
            <button
              className={`lib-tab ${libraryTab === "playlists" ? "active" : ""}`}
              onClick={() => setLibraryTab("playlists")}
            >
              Playlists
            </button>
            <button
              className={`lib-tab ${libraryTab === "artists" ? "active" : ""}`}
              onClick={() => setLibraryTab("artists")}
            >
              Artists
            </button>
          </div>

          <div className="library-list">
            {libraryTab === "playlists" && (
              <div className="playlist-item">
                <div className="playlist-thumb liked">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div className="playlist-info">
                  <span className="playlist-name">Liked Songs</span>
                  <span className="playlist-meta">Playlist · 35 songs</span>
                </div>
              </div>
            )}
            {libraryTab === "artists" &&
              sidebarArtists.map((a) => (
                <div key={a.name} className="playlist-item">
                  <img src={a.img} alt={a.name} className="artist-thumb" />
                  <div className="playlist-info">
                    <span className="playlist-name">{a.name}</span>
                    <span className="playlist-meta">Artist</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="nav-arrows">
            <button className="arrow-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
              </svg>
            </button>
            <button className="arrow-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </div>
          <div className="top-bar-right">
            <button className="premium-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3l1.09 3.26L16 7.27l-2.91 2.84.69 4.02L12 12.25l-1.78.88.69-4.02L8 6.27l2.91-.99z" />
              </svg>
              Explore Premium
            </button>
            <button className="icon-btn bell-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
            <div className="avatar">M</div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="content-body">
          {/* Greeting */}
          <section className="greeting-section">
            <h1 className="greeting-title">Good afternoon</h1>
            <p className="greeting-sub">Your day, your sound. Scan your mood for a personal mix.</p>
          </section>

          {/* Mood Scanner Banner */}
          <div className="mood-banner">
            <div className="banner-left">
              <span className="banner-badge">NEW · MEDIAPIPE POWERED</span>
              <h2 className="banner-headline">Music that reads your face.</h2>
              <p className="banner-desc">
                Open your camera, smile, frown, or stay neutral. We analyse 52 facial blendshapes locally in
                your browser and queue songs that match the vibe.
              </p>
            </div>
            <div className="banner-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1ed760" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <button className="scan-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Scan my mood
            </button>
          </div>

          {/* Daily Mixes */}
          <section className="mixes-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Made For Moodify</h2>
                <p className="section-sub">Personal daily mixes</p>
              </div>
              <button className="show-all-btn">SHOW ALL</button>
            </div>
            <div className="mixes-grid">
              {dailyMixes.map((mix) => (
                <div key={mix.id} className="mix-card">
                  <div className="mix-thumb-wrap">
                    <img src={mix.img} alt={mix.title} className="mix-thumb" />
                    <div className="mix-overlay">
                      <button className="play-circle" onClick={() => setIsPlaying(!isPlaying)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mix-title">{mix.title}</p>
                  <p className="mix-sub">{mix.subtitle}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Player Bar */}
      <footer className="player-bar">
        <div className="player-left">
          <span className="player-track-info">Pick a song to start playing</span>
        </div>
        <div className="player-center">
          <div className="player-controls">
            <button className="ctrl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>
            <button className="ctrl-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button className="play-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button className="ctrl-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <button className="ctrl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            </button>
          </div>
          <div className="progress-bar-wrap">
            <span className="time-label">0:00</span>
            <div className="progress-track" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="time-label">0:00</span>
          </div>
        </div>
        <div className="player-right">
          <button className="ctrl-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </button>
          <button className="ctrl-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
            </svg>
          </button>
          <button className="ctrl-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
          <div className="volume-wrap">
            <input
              type="range"
              className="volume-slider"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
          <button className="ctrl-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
