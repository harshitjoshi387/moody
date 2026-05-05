import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Loader2, Music, User, Frown, Smile, Meh, Play } from 'lucide-react';

const MOOD_SONGS = {
  Happy: { title: "Walking on Sunshine", artist: "Katrina & The Waves", cover: "https://picsum.photos/300?random=11", color: "from-yellow-400 to-orange-500" },
  Sad: { title: "Someone Like You", artist: "Adele", cover: "https://picsum.photos/300?random=12", color: "from-blue-600 to-indigo-900" },
  Neutral: { title: "Breezeblocks", artist: "alt-J", cover: "https://picsum.photos/300?random=13", color: "from-gray-400 to-gray-600" },
  Angry: { title: "Break Stuff", artist: "Limp Bizkit", cover: "https://picsum.photos/300?random=14", color: "from-red-600 to-red-900" }
};

const FaceExpression = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [mood, setMood] = useState(null);
  const [stream, setStream] = useState(null);
  const [suggestedSong, setSuggestedSong] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    setMood(null);
    setSuggestedSong(null);
    
    // Simulating MediaPipe face detection and expression analysis
    setTimeout(async () => {
      const moods = ['happy', 'sad', 'surprised'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(randomMood);

      try {
        const res = await fetch('http://localhost:3000/api/songs/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood: randomMood })
        });
        const songs = await res.json();
        
        if (songs && songs.length > 0) {
          // Pick a random song from the suggested ones
          setSuggestedSong(songs[Math.floor(Math.random() * songs.length)]);
        } else {
           setSuggestedSong(null);
        }
      } catch (e) {
        console.error("Failed to fetch suggested song:", e);
      } finally {
        setIsScanning(false);
      }
    }, 3000);
  };

  return (
    <div className="h-screen w-full bg-[#121212] text-white flex flex-col relative overflow-hidden">
      {/* Background Gradient */}
      <motion.div 
        animate={{
          background: mood 
            ? `linear-gradient(to bottom right, var(--tw-gradient-stops))`
            : 'linear-gradient(to bottom right, #1db954, #121212)'
        }}
        className={`absolute inset-0 opacity-20 ${
          mood === 'happy' ? 'from-yellow-400 to-orange-500' :
          mood === 'sad' ? 'from-blue-600 to-indigo-900' :
          mood === 'surprised' ? 'from-purple-500 to-pink-600' : ''
        }`}
      />

      {/* Header */}
      <div className="z-10 p-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 hover:text-[#1db954] transition bg-black/40 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
        <h1 className="text-xl font-bold tracking-wider">Mood Scanner</h1>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex items-center justify-center z-10 px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Scanner Section */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative rounded-2xl overflow-hidden border-4 border-[#282828] bg-black aspect-[4/3] w-full max-w-md shadow-2xl"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              
              {/* Scanning Overlay */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ 
                        top: ['0%', '100%', '0%']
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-1 bg-[#1db954] shadow-[0_0_15px_#1db954]"
                    />
                    <Loader2 className="w-12 h-12 text-[#1db954] animate-spin mb-4" />
                    <p className="text-[#1db954] font-semibold tracking-widest">ANALYZING EXPRESSION...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <button
              onClick={startScan}
              disabled={isScanning}
              className={`mt-8 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 ${
                isScanning 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-[#1db954] hover:bg-[#1ed760] text-black shadow-[0_0_20px_rgba(29,185,84,0.3)]'
              }`}
            >
              <Camera size={24} />
              {isScanning ? 'Scanning...' : 'Scan My Face'}
            </button>
          </div>

          {/* Result Section */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {!mood && !isScanning && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center text-gray-400 flex flex-col items-center"
                >
                  <User size={64} className="mb-4 opacity-50" />
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to vibe?</h2>
                  <p>Scan your face to let our AI suggest<br/>the perfect track for your current mood.</p>
                </motion.div>
              )}

              {mood && !isScanning && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-[#181818] rounded-2xl p-6 shadow-2xl border border-[#282828]"
                >
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#282828]">
                    {mood === 'happy' && <Smile className="text-yellow-400 w-8 h-8" />}
                    {mood === 'sad' && <Frown className="text-blue-400 w-8 h-8" />}
                    {mood === 'surprised' && <Meh className="text-purple-400 w-8 h-8" />}
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider">Detected Mood</p>
                      <h3 className="text-2xl font-bold capitalize">{mood}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-semibold">Suggested Track</p>
                  
                  {suggestedSong ? (
                    <div 
                      onClick={() => navigate('/home', { state: { playSong: suggestedSong } })}
                      className="flex items-center gap-4 bg-[#282828] p-4 rounded-xl hover:bg-[#333] transition cursor-pointer group"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shadow-lg flex-shrink-0">
                        <img src={suggestedSong.poster || "https://picsum.photos/300"} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#1db954] transition truncate">{suggestedSong.title}</h4>
                        <p className="text-gray-400 truncate">{suggestedSong.artist}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 bg-[#282828] p-4 rounded-xl text-center">
                      No matching song found in Database. Please upload a "{mood}" song.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceExpression;
