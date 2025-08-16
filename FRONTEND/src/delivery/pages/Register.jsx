import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    vehicleNumber: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:9099/api/delivery/auth/register", form);
      navigate("/delivery/login"); // Redirect to login
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-top bg-no-repeat flex items-center justify-end"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1663126491340-e96b3b7205b6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0')"
      }}
    >
        {/* Text Overlay on Background */}
        <div className="text-white md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Become a Delivery Partner
            Earn money on your own schedule.
          </h1>
        </div>

      <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-sm  mr-24 ml-[-40px]">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Delivery Partner Registration
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={handleChange}
className="w-72 mb-4 px-4 py-2 border border-gray-300 rounded-full mx-auto block"
            required
          />
          <button
            type="submit"
  className="w-72 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition mx-auto block"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/delivery/login" className="text-orange-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
