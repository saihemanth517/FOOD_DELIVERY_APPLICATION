import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:9099/api/delivery/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setEditProfile(res.data);
      })
      .catch((err) => console.error("Error fetching profile", err))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:9099/api/delivery/auth/profile",
        editProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Update failed!");
    }
  };

  const handleCancel = () => {
    setEditProfile(profile); // revert changes
    setIsEditing(false);     // exit editing mode
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const fields = {
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    vehicleNumber: "Vehicle Number",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

        {Object.entries(fields).map(([key, label]) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}</label>
            {isEditing ? (
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={editProfile[key] || ""}
                onChange={(e) =>
                  setEditProfile({ ...editProfile, [key]: e.target.value })
                }
              />
            ) : (
              <div className="bg-gray-100 px-3 py-2 rounded">
                {profile[key] || "-"}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={updateProfile}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
