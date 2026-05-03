import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, Plus, ArrowRight, Search, ChevronLeft, ChevronRight,
  ScanFace, Bell, Users, Play, Pause, SkipBack, SkipForward, Repeat,
  Shuffle, Mic2, MonitorSpeaker, Volume2, Heart, User, ExternalLink
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const artists = [
    { name: "Sonu Nigam", type: "Artist", img: "https://picsum.photos/100?random=1" },
    { name: "Vishal-Shekhar", type: "Artist", img: "https://picsum.photos/100?random=2" },
    { name: "Atif Aslam", type: "Artist", img: "https://picsum.photos/100?random=3" },
    { name: "Arijit Singh", type: "Artist", img: "https://picsum.photos/100?random=4" }
  ];

  const followingArtists = [
    { name: "Arijit Singh", type: "Artist", img: "https://picsum.photos/300?random=51" },
    { name: "Atif Aslam", type: "Artist", img: "https://picsum.photos/300?random=52" },
    { name: "Sonu Nigam", type: "Artist", img: "https://picsum.photos/300?random=53" },
    { name: "Vishal-Shekhar", type: "Artist", img: "https://picsum.photos/300?random=54" }
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Top Navbar & Main Content Container */}
      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[320px] bg-[#121212] rounded-lg flex flex-col overflow-hidden hidden md:flex">
          {/* Library Header */}
          <div className="p-4 flex items-center justify-between text-gray-400 font-semibold shadow-sm">
            <button className="flex items-center gap-3 hover:text-white transition">
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
            <div className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-300 flex items-center justify-center rounded-md">
                <Heart size={20} fill="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Liked Songs</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="text-[#1db954]">📌</span> Playlist • 35 songs
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
          <div className="h-16 flex items-center justify-between px-6 bg-transparent z-20 absolute top-0 w-full">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="w-8 h-8 bg-black/60 hover:bg-black/80 transition rounded-full flex items-center justify-center text-white">
                <ChevronLeft size={20} />
              </button>
              <button className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-gray-400 cursor-not-allowed">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 relative">
              <button className="text-gray-400 hover:text-white transition hidden lg:block font-semibold text-sm bg-black/60 px-4 py-1.5 rounded-full">Explore Premium</button>
              <button className="text-gray-400 hover:text-white transition hidden lg:block font-semibold text-sm bg-black/60 px-4 py-1.5 rounded-full">Install App</button>
              <button className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition"><Bell size={18} /></button>
              <button className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition hidden sm:flex"><Users size={18} /></button>
              
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
          <div className="flex-1 overflow-y-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-b from-[#535353] to-[#121212] pt-24 pb-6 px-8 flex items-end gap-6 h-[340px]">
              <div className="w-[232px] h-[232px] bg-[#282828] rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                <User size={100} className="text-[#b3b3b3]" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Profile</span>
                <h1 className="text-8xl font-black tracking-tighter mb-4">Harsh</h1>
                <p className="text-sm text-gray-300 font-semibold">• 4 Following</p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 py-6">
              <div className="flex items-center gap-6 mb-8">
                <button className="text-gray-400 hover:text-white transition">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                    <span className="text-lg leading-none mb-1">...</span>
                  </div>
                </button>
              </div>

              {/* Following Section */}
              <div>
                <div className="flex items-end justify-between mb-6">
                  <h2 className="text-2xl font-bold hover:underline cursor-pointer">Following</h2>
                </div>
                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                  {followingArtists.map((artist, idx) => (
                    <motion.div 
                      key={idx} 
                      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all group cursor-pointer relative min-w-[200px] w-[200px] flex-shrink-0 flex flex-col items-center text-center"
                    >
                      <div className="relative mb-4 rounded-full overflow-hidden w-full aspect-square shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                        <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-[#1db954] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-[#1ed760]">
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      <h3 className="font-bold text-white mb-1 w-full truncate">{artist.name}</h3>
                      <p className="text-sm text-gray-400">Artist</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Playback Bar (Static representation for Profile) */}
      <div className="h-[90px] bg-black border-t border-[#282828] px-4 flex items-center justify-between z-20">
        <div className="w-[30%] flex items-center gap-4">
          <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center overflow-hidden">
             <Heart size={24} className="text-gray-400" />
          </div>
          <div className="hidden sm:block">
             <p className="text-white text-sm font-semibold hover:underline cursor-pointer">No track selected</p>
             <p className="text-xs text-gray-400 hover:underline cursor-pointer">Choose a song</p>
          </div>
        </div>
        <div className="w-[40%] flex flex-col items-center">
          <div className="flex items-center gap-6 mb-2 text-gray-400">
            <Shuffle size={18} className="hover:text-white transition" />
            <SkipBack size={20} className="hover:text-white transition" />
            <button className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition">
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </button>
            <SkipForward size={20} className="hover:text-white transition" />
            <Repeat size={18} className="hover:text-white transition" />
          </div>
          <div className="flex items-center gap-2 w-full max-w-[600px] text-xs text-gray-400">
            <span>0:00</span>
            <div className="h-1 bg-[#4d4d4d] rounded-full flex-1"><div className="h-full bg-white w-0 rounded-full"></div></div>
            <span>0:00</span>
          </div>
        </div>
        <div className="w-[30%] flex items-center justify-end gap-3 text-gray-400">
          <Volume2 size={16} className="hover:text-white transition" />
          <div className="w-24 h-1 bg-[#4d4d4d] rounded-full"><div className="h-full bg-white w-1/2 rounded-full"></div></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
