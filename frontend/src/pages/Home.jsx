import React from 'react'

const Home = () => {
  return (
   
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <div className="w-[250px] bg-black p-4 border-r border-gray-800 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Moodify</h1>

        <div className="flex flex-col gap-2 text-gray-400">
          <p className="hover:text-white cursor-pointer">Home</p>
          <p className="hover:text-white cursor-pointer">Search</p>
          <p className="text-green-400 cursor-pointer">Mood Scanner</p>
        </div>

        <div className="mt-5">
          <p className="text-gray-400 text-sm">Your Library</p>
        </div>

        <div className="mt-3 flex flex-col gap-3 text-sm">
          <p>Liked Songs</p>
          <p>Lumen Bay</p>
          <p>Maya Solis</p>
          <p>Eli North</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Good afternoon</h1>

          <button className="bg-white text-black px-4 py-2 rounded-full">
            Explore Premium
          </button>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-green-700 to-black p-6 rounded-xl flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-green-300">NEW • MEDIAPIPE POWERED</p>
            <h2 className="text-2xl font-bold">
              Music that reads your face.
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Scan your mood and get songs that match your vibe.
            </p>
          </div>

          <button className="bg-white text-black px-4 py-2 rounded-full">
            Scan my mood
          </button>
        </div>

        {/* Cards */}
        <h2 className="text-xl font-semibold mb-4">Made For Moodify</h2>

        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] cursor-pointer transition"
            >
              <img
                src={`https://picsum.photos/200?random=${item}`}
                className="rounded mb-2"
              />
              <p className="font-semibold">Daily Mix {item}</p>
              <p className="text-xs text-gray-400">
                Artist names...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 w-full bg-[#181818] p-4 flex justify-center items-center border-t border-gray-800">
        <button className="bg-white text-black rounded-full px-4 py-2">
          ▶ Play
        </button>
      </div>

    </div>
  );
};

export default Home;
   


