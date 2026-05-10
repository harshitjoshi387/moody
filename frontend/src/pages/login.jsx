import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home", { replace: true });
  };

  const handleDemoLogin = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      
      <div className="w-[350px] bg-[#121212] text-white shadow-2xl rounded-xl p-6 border border-gray-800">
        
        <p className="text-center text-2xl font-bold mb-6">
          Log in to Moodify
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email address"
            required
            className="rounded-md bg-black border border-gray-700 px-4 py-2 outline-none focus:border-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="rounded-md bg-black border border-gray-700 px-4 py-2 outline-none focus:border-green-500"
          />

          <p className="text-right text-gray-400 text-xs underline cursor-pointer hover:text-white">
            Forgot your password?
          </p>

          <button
            type="submit"
            className="bg-green-400 text-black font-semibold rounded-full py-2 hover:bg-green-500 transition-all duration-200"
          >
            Log In
          </button>
        </form>

        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        <button 
          onClick={handleDemoLogin}
          type="button"
          className="w-full flex items-center justify-center rounded-full px-4 py-2 border border-gray-600 hover:border-white hover:bg-[#282828] cursor-pointer transition mb-3"
        >
          <span>Try Demo Login (Free)</span>
        </button>

        <div className="flex items-center justify-center rounded-full px-4 py-2 border border-gray-600 hover:border-white cursor-pointer transition">
          <span>Continue with Google</span>
        </div>

        <p className="text-xs text-gray-400 mt-5 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white underline cursor-pointer hover:text-green-400"
          >
            Sign up for Moodify
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;