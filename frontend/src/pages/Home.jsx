import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, Plus, ArrowRight, Search, ChevronLeft, ChevronRight,
  ScanFace, Bell, Users, Play, Pause, SkipBack, SkipForward, Repeat,
  Shuffle, Mic2, MonitorSpeaker, Volume2, VolumeX, Heart, ExternalLink
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbSongs, setDbSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // New States
  const [volume, setVolume] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('likedSongs');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentView, setCurrentView] = useState("all");

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  const toggleLike = (song, e) => {
    if (e) e.stopPropagation();
    if (!song) return;
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s._id === song._id);
      if (isLiked) {
        return prev.filter(s => s._id !== song._id);
      } else {
        return [...prev, song];
      }
    });
  };

  const audioRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/songs`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setDbSongs(data);
        }
      } catch (error) {
        console.error("Error fetching songs from backend:", error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (location.state && location.state.playSong) {
      const songToPlay = location.state.playSong;
      
      setDbSongs(prev => {
        if (!prev.some(s => s._id === songToPlay._id)) {
          return [songToPlay, ...prev];
        }
        return prev;
      });

      setCurrentSong(songToPlay);
      setIsPlaying(true);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlaySong = (song) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  // Handle Volume
  const handleVolumeClick = (e) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      let percent = (e.clientX - bounds.left) / bounds.width;
      if (percent < 0) percent = 0;
      if (percent > 1) percent = 1;
      audioRef.current.volume = percent;
      setVolume(percent);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        audioRef.current.volume = 0;
        setVolume(0);
      } else {
        audioRef.current.volume = 1;
        setVolume(1);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const artists = [
    { name: "Sonu Nigam", type: "Artist", img: "https://picsum.photos/100?random=1" },
    { name: "Vishal-Shekhar", type: "Artist", img: "https://picsum.photos/100?random=2" },
    { name: "Atif Aslam", type: "Artist", img: "https://picsum.photos/100?random=3" },
    { name: "Arijit Singh", type: "Artist", img: "https://picsum.photos/100?random=4" }
  ];

  const popularArtists = [
    { name: "Pritam", img: "https://picsum.photos/300?random=31" },
    { name: "Arijit Singh", img: "https://picsum.photos/300?random=32" },
    { name: "Udit Narayan", img: "https://picsum.photos/300?random=33" },
    { name: "A.R. Rahman", img: "https://picsum.photos/300?random=34" },
    { name: "Atif Aslam", img: "https://picsum.photos/300?random=35" }
  ];

  const fallbackSongs = [
    { _id: '1', title: "Hot Hits Hindi", artist: "Hottest Hindi music", poster: "https://picsum.photos/300?random=41", url: "" },
    { _id: '2', title: "Latest Tamil", artist: "New Music from Kollywood", poster: "https://picsum.photos/300?random=42", url: "" }
  ];

  const displaySongs = currentView === 'liked' ? likedSongs : (dbSongs.length > 0 ? dbSongs : fallbackSongs);
  const activeSong = currentSong || (displaySongs.length > 0 ? displaySongs[0] : null);

  const playNextSong = () => {
    if (!currentSong) return;
    const currentIndex = displaySongs.findIndex(s => s._id === currentSong._id);
    if (currentIndex !== -1) {
      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * displaySongs.length);
      } else {
        nextIndex = (currentIndex + 1) % displaySongs.length;
      }
      
      const nextSong = displaySongs[nextIndex];
      if (currentSong._id === nextSong._id) {
         if (audioRef.current) {
           audioRef.current.currentTime = 0;
           audioRef.current.play().catch(e => console.error("Playback error:", e));
         }
         setIsPlaying(true);
      } else {
         setCurrentSong(nextSong);
         setIsPlaying(true);
      }
    }
  };

  const playPrevSong = () => {
    if (!currentSong) return;
    const currentIndex = displaySongs.findIndex(s => s._id === currentSong._id);
    if (currentIndex !== -1) {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = displaySongs.length - 1;
      const prevSong = displaySongs[prevIndex];
      
      if (currentSong._id === prevSong._id) {
         if (audioRef.current) {
           audioRef.current.currentTime = 0;
           audioRef.current.play().catch(e => console.error("Playback error:", e));
         }
         setIsPlaying(true);
      } else {
         setCurrentSong(prevSong);
         setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentSong?.url || currentSong?.file?.url || ""}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (isAutoplay) {
            playNextSong();
          } else {
            setIsPlaying(false);
          }
        }}
      />

      {/* Top Navbar & Main Content Container */}
      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[320px] bg-[#121212] rounded-lg flex flex-col overflow-hidden hidden md:flex">
          {/* Library Header */}
          <div className="p-4 flex items-center justify-between text-gray-400 font-semibold shadow-sm">
            <button onClick={() => setCurrentView('all')} className={`flex items-center gap-3 transition ${currentView === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              <Library size={24} />
              <span>Your Library</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-[#1a1a1a] hover:text-white rounded-full transition"><Plus size={20} /></button>
              <button className="p-1.5 hover:bg-[#1a1a1a] hover:text-white rounded-full transition"><ArrowRight size={20} /></button>
            </div>
          </div>
          
          <div className="px-4 pb-2">
            <button className="px-3 py-1 bg-[#232323] hover:bg-[#2a2a2a] text-sm rounded-full transition">Artists</button>
          </div>

          <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-400">
            <Search size={16} className="hover:text-white cursor-pointer" />
            <span className="hover:text-white cursor-pointer flex items-center gap-1">Recents</span>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div 
              onClick={() => setCurrentView('liked')}
              className={`flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition ${currentView === 'liked' ? 'bg-[#1a1a1a]' : ''}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-300 flex items-center justify-center rounded-md">
                <Heart size={20} fill="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Liked Songs</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="text-[#1db954]">📌</span> Playlist • {likedSongs.length} songs
                </p>
              </div>
            </div>

            {artists.map((artist, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition">
                <img src={artist.img} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-semibold text-sm">{artist.name}</p>
                  <p className="text-xs text-gray-400">{artist.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-[#121212] rounded-lg flex flex-col overflow-hidden relative">
          
          {/* Topbar */}
          <div className="h-16 flex items-center justify-between px-6 bg-[#121212]/80 backdrop-blur-md z-20 sticky top-0">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="w-8 h-8 bg-black/60 hover:bg-black/80 transition rounded-full flex items-center justify-center text-white cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => navigate(1)} className="w-8 h-8 bg-black/60 hover:bg-black/80 transition rounded-full flex items-center justify-center text-white cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex-1 max-w-[400px] ml-4">
              <div className="flex items-center bg-[#242424] hover:bg-[#2a2a2a] border border-transparent hover:border-[#333] transition-all rounded-full px-4 py-2 group">
                <Search size={20} className="text-gray-400 group-hover:text-white" />
                <input 
                  type="text" 
                  placeholder="What do you want to play?" 
                  className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mood-scan')}
                className="bg-gradient-to-r from-[#1db954] to-emerald-600 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(29,185,84,0.3)] hover:shadow-[0_0_20px_rgba(29,185,84,0.5)] transition-shadow text-sm"
              >
                <ScanFace size={18} />
                Scan Face Expression
              </motion.button>
              <button className="text-gray-400 hover:text-white transition hidden lg:block font-semibold text-sm">Install App</button>
              <button className="text-gray-400 hover:text-white transition"><Bell size={18} /></button>
              <button className="text-gray-400 hover:text-white transition hidden sm:block"><Users size={18} /></button>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 bg-orange-600 hover:scale-105 transition rounded-full flex items-center justify-center font-bold text-sm"
                >
                  H
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#282828] rounded-md shadow-2xl py-1 z-50 text-sm font-semibold text-white/90 border border-[#3e3e3e]"
                    >
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex items-center justify-between transition">Account <ExternalLink size={16} className="opacity-70"/></button>
                      <button onClick={() => {navigate('/profile'); setShowDropdown(false);}} className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition">Profile</button>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition">Recents</button>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex items-center justify-between transition">Upgrade to Premium <ExternalLink size={16} className="opacity-70"/></button>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex items-center justify-between transition">Support <ExternalLink size={16} className="opacity-70"/></button>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex items-center justify-between transition">Download <ExternalLink size={16} className="opacity-70"/></button>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition">Settings</button>
                      <div className="h-[1px] bg-[#3e3e3e] my-1"></div>
                      <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition" onClick={() => navigate('/')}>Log out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-24 pt-2">
            <div className="flex gap-2 mb-8">
              <button className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm">All</button>
              <button className="px-4 py-1.5 bg-[#232323] hover:bg-[#2a2a2a] text-white font-semibold rounded-full text-sm transition">Music</button>
              <button className="px-4 py-1.5 bg-[#232323] hover:bg-[#2a2a2a] text-white font-semibold rounded-full text-sm transition">Podcasts</button>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-10">
              
              {/* Dynamic Songs Section */}
              <div>
                <div className="flex items-end justify-between mb-4">
                  <h2 className="text-2xl font-bold hover:underline cursor-pointer">
                    {currentView === 'liked' ? "Liked Songs" : (dbSongs.length > 0 ? "Songs Library" : "Hot Hits")}
                  </h2>
                  <span className="text-sm text-gray-400 font-bold hover:underline cursor-pointer">Show all</span>
                </div>
                
                {displaySongs.length === 0 && currentView === 'liked' ? (
                  <div className="text-gray-400 text-sm py-10 text-center">No liked songs yet. Go find some music you love!</div>
                ) : (
                <div className="flex flex-wrap pb-4 gap-6">
                  {displaySongs.map((song, idx) => {
                    const isThisPlaying = currentSong?._id === song._id && isPlaying;
                    const isLiked = likedSongs.some(s => s._id === song._id);
                    return (
                      <motion.div 
                        variants={itemVariants}
                        key={song._id || idx} 
                        className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all group cursor-pointer relative min-w-[200px] w-[200px] flex-shrink-0"
                        onClick={() => handlePlaySong(song)}
                      >
                        <div className="relative mb-4 shadow-lg rounded-md overflow-hidden aspect-square">
                          <img src={song.poster || `https://picsum.photos/300?random=${idx + 40}`} alt={song.title} className="w-full h-full object-cover" />
                          
                          <button 
                            onClick={(e) => toggleLike(song, e)}
                            className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all ${isLiked ? 'text-[#1db954] opacity-100' : 'text-white opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                          </button>
                          
                          <div className={`absolute bottom-2 right-2 z-10 bg-[#1db954] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-[#1ed760] transition-all duration-300 ${isThisPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                            {isThisPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                          </div>
                        </div>
                        <h3 className={`font-bold mb-1 truncate text-base ${isThisPlaying ? 'text-[#1db954]' : 'text-white'}`}>{song.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{song.artist}</p>
                      </motion.div>
                    )
                  })}
                </div>
                )}
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Playback Bar */}
      <div className="h-[90px] bg-black border-t border-[#282828] px-4 flex items-center justify-between z-20">
        
        {/* Now Playing Info */}
        <div className="w-[30%] flex items-center gap-4">
          <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center overflow-hidden">
            <img src={activeSong?.poster || "https://picsum.photos/100?random=30"} alt="Now Playing" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-semibold hover:underline cursor-pointer truncate max-w-[150px]">
              {activeSong?.title || "No track selected"}
            </p>
            <p className="text-xs text-gray-400 hover:underline cursor-pointer truncate max-w-[150px]">
              {activeSong?.artist || "Unknown Artist"}
            </p>
          </div>
          <button onClick={() => toggleLike(activeSong)}>
            <Heart size={16} className={`ml-2 hidden md:block transition hover:scale-110 ${likedSongs.some(s => s._id === activeSong?._id) ? 'text-[#1db954]' : 'text-gray-400 hover:text-white'}`} fill={likedSongs.some(s => s._id === activeSong?._id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="w-[40%] flex flex-col items-center">
          <div className="flex items-center gap-6 mb-2 text-gray-400">
            <button onClick={() => setIsShuffle(!isShuffle)}>
              <Shuffle size={18} className={`hover:text-white transition hidden sm:block ${isShuffle ? 'text-[#1db954]' : ''}`} />
            </button>
            <button onClick={playPrevSong}>
              <SkipBack size={20} className="hover:text-white transition fill-current" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            
            <button onClick={playNextSong}>
              <SkipForward size={20} className="hover:text-white transition fill-current" />
            </button>
            <button onClick={() => setIsAutoplay(!isAutoplay)}>
              <Repeat size={18} className={`hover:text-white transition hidden sm:block ${isAutoplay ? 'text-[#1db954]' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-[600px] text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="h-1 bg-[#4d4d4d] rounded-full flex-1 group cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-all duration-100 ease-linear"
                style={{ left: `calc(${progress}% - 6px)` }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="w-[30%] flex items-center justify-end gap-3 text-gray-400 hidden md:flex">
          <Mic2 size={16} className="hover:text-white transition" />
          <MonitorSpeaker size={16} className="hover:text-white transition" />
          <button onClick={toggleMute} className="hover:text-white transition">
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div 
            className="w-24 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"
            onClick={handleVolumeClick}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${volume * 100}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-all duration-100 ease-linear"
              style={{ left: `calc(${volume * 100}% - 6px)` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
