import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:9099/api/delivery/auth/login", {
        phone,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("partnerId", response.data.partnerId);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid phone or password");
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-top bg-no-repeat flex items-center justify-end"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1663126491340-e96b3b7205b6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0')",
      }}
    >
      {/* Text Section */}
      <div className="text-white md:w-1/2 mb-10 md:mb-0 text-center md:text-left ml-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome Back Partner
          <br />
          Login to start delivering!
        </h1>
      </div>

      {/* Login Form */}
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-sm mr-24 ml-[-40px]">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Delivery Partner Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <button
            type="submit"
            className="w-72 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition mx-auto block"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-orange-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
