
import { useState, useRef, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Register component (inline)
const Register = ({ onBack }) => {
    const refUsername = useRef(null); // username
    const refPassword = useRef(null); // password
    const refRole = useRef(null); // role (hidden, set by dropdown)
    const refName = useRef(null); // name (full name)
    const [userType, setUserType] = useState("CUSTOMER");

    const register = async () => {
        try {
            const res = await axios.post("http://localhost:9090/register", {
                username: refUsername.current.value,
                password: refPassword.current.value,
                role: refRole.current.value,
                name: refName.current.value
            });
            const { data } = res;
            if (data && data.message === "Registration Success") {
                alert("Registration Success !!!");
                onBack();
            } else {
                alert("Registration Fail !!!");
            }
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                alert("Registration Error: " + e.response.data.message);
            } else {
                alert("Registration Error! Check console for details.");
            }
            console.error("Registration error:", e);
        }
    };

    // Set default role automatically
    // Set the value of ref3 to 'ROLE_CUSTOMER' on mount
    useEffect(() => {
        if (refRole.current) {
            // Set initial role value
            refRole.current.value = "ROLE_CUSTOMER";
        }
    }, []);

    // Update hidden role input when userType changes
    useEffect(() => {
        if (refRole.current) {
            if (userType === "CUSTOMER") refRole.current.value = "ROLE_CUSTOMER";
            else if (userType === "restaurant") refRole.current.value = "ROLE_RESOWNER";
            else if (userType === "delivery_partner") refRole.current.value = "ROLE_DELIVERYP";
        }
    }, [userType]);

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6 items-center">
            <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-2">Register</h2>
            <input type="text" ref={refName} placeholder="Enter full name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none mb-2" />
            <input type="text" ref={refUsername} placeholder="Enter username (email)" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none mb-2" />
            <input type="password" ref={refPassword} placeholder="Enter password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none mb-2" />
            {/* Dropdown for user type */}
            <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none mb-2"
            >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="restaurant">restaurant</option>
                <option value="delivery_partner">delivery_partner</option>
            </select>
            {/* Hidden role input, set by dropdown */}
            <input type="hidden" ref={refRole} />
            <div className="flex flex-row gap-4 w-full mt-2 mb-2">
                <button onClick={register} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-lg shadow transition-colors">Register</button>
                <button onClick={onBack} className="w-full py-3 bg-gray-500 hover:bg-gray-700 text-white rounded-lg font-bold text-lg shadow transition-colors">Back to Login</button>
            </div>
            <div className="w-full flex justify-center mt-2">
                <GoogleLogin
                    onSuccess={async credentialResponse => {
                        try {
                            const res = await axios.post("http://localhost:9090/auth/google", {
                                credential: credentialResponse.credential
                            });
                            const { data } = res;
                            const { login, role, token, username, name } = data;
                            if (login === "success") {
                                window.localStorage.setItem("token", token);
                                if (username) window.localStorage.setItem("username", username);
                                if (name) window.localStorage.setItem("name", name);
                                // Redirect based on role
                                switch (role) {
                                    case "ROLE_CUSTOMER":
                                        window.location.href = "/CusDashboard";
                                        break;
                                    case "ROLE_ADMIN":
                                        window.location.href = "/admindashboard";
                                        break;
                                    case "ROLE_RESOWNER":
                                        window.location.href = "/resowner";
                                        break;
                                    case "ROLE_DELIVERYP":
                                        window.location.href = "/deliveryp";
                                        break;
                                    default:
                                        window.location.href = "/error";
                                }
                            } else {
                                window.location.href = "/error";
                            }
                        } catch (e) {
                            window.location.href = "/error";
                        }
                    }}
                    onError={() => {
                        alert('Google OAuth Failed');
                    }}
                    width="100%"
                />
            </div>
        </div>
    );
};


const Login = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const login = async () => {
        try {
            const res = await axios.post("http://localhost:9090/login", {
                username: ref1.current.value,
                password: ref2.current.value,
            });
            const { data } = res;
            const { login, role, token } = data;
            if (login === "success") {
                window.localStorage.setItem("token", token);
                switch (role) {
                    case "ROLE_CUSTOMER":
                        navigate("/CusDashboard");
                        break;
                    case "ROLE_ADMIN":
                        navigate("/admindashboard");
                        break;
                    case "ROLE_RESOWNER":
                        navigate("/resowner");
                        break;
                    case "ROLE_DELIVERYP":
                        navigate("/deliveryp");
                        break;
                    default:
                        navigate("/error");
                }
            } else {
                navigate("/error");
            }
        } catch (e) {
            navigate("/error");
        }
    };

    if (showRegister) {
        return (
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
                    <Register onBack={() => setShowRegister(false)} />
                </div>
            </GoogleOAuthProvider>
        );
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6">
                    <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-2">Login</h2>
                    <p className="text-lg text-gray-600 text-center mb-4">Welcome to the Food chain</p>

                    <label className="text-base font-medium text-gray-700">Email Address</label>
                    <input
                        type="text"
                        ref={ref1}
                        placeholder="email@website.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none"
                    />

                    <label className="text-base font-medium text-gray-700">Password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            ref={ref2}
                            placeholder="************"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base outline-none"
                        />
                        <span
                            className="absolute right-4 text-orange-600 font-semibold cursor-pointer select-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>

                    <button
                        onClick={login}
                        className="w-full mt-2 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-lg shadow transition-colors"
                    >
                        Login
                    </button>
                    <div className="flex flex-row gap-4 mt-4 items-center w-full">
                        <div className="flex-1 flex justify-center">
                            <GoogleLogin
                                onSuccess={async credentialResponse => {
                                    try {
                                        const res = await axios.post("http://localhost:9090/auth/google", {
                                            credential: credentialResponse.credential
                                        });
                                        const { data } = res;
                                        const { login, role, token, username, name } = data;
                                        if (login === "success") {
                                            window.localStorage.setItem("token", token);
                                            if (username) window.localStorage.setItem("username", username);
                                            if (name) window.localStorage.setItem("name", name);
                                            switch (role) {
                                                case "ROLE_CUSTOMER":
                                                    navigate("/CusDashboard");
                                                    break;
                                                case "ROLE_ADMIN":
                                                    navigate("/admindashboard");
                                                    break;
                                                case "ROLE_RESOWNER":
                                                    navigate("/resowner");
                                                    break;
                                                case "ROLE_DELIVERYP":
                                                    navigate("/deliveryp");
                                                    break;
                                                default:
                                                    navigate("/error");
                                            }
                                        } else {
                                            navigate("/error");
                                        }
                                    } catch (e) {
                                        navigate("/error");
                                    }
                                }}
                                onError={() => {
                                    navigate("/error");
                                }}
                                width="100%"
                            />
                        </div>
                        <button
                            onClick={() => setShowRegister(true)}
                            className="w-full py-3 bg-gray-500 hover:bg-gray-700 text-white rounded-lg font-bold text-lg shadow transition-colors"
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

const styles = {
    
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
        width: "420px",
        padding: "40px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "px",
    },
    subheading: {
        fontSize: "18px",
        color: "#6b7280",
        marginBottom: "15px",
    },
    label: {
        fontSize: "16px",
        color: "#374151",
        fontWeight: "500",
        marginBottom: "0px",
    },
    input: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        width: "100%",
    },
    passwordWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    passwordInput: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        width: "100%",
    },
    showText: {
        position: "absolute",
        right: "14px",
        color: "#4f46e5",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },
    button: {
        marginTop: "20px",
        padding: "14px 0",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default Login;
