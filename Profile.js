import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [greeting, setGreeting] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ✅ Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch user profile
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setProfilePicFile(e.target.files[0]);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ✅ Save updated profile (supports image)
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
      if (profilePicFile) formDataToSend.append("profilePic", profilePicFile);

      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(data);
      setFormData(data);
      setProfilePicFile(null);
      setEditMode(false);
      showToastMessage("✅ Profile updated successfully!", "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToastMessage("❌ Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setProfilePicFile(null);
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 className="logo">
          Smart<span>Scheduler</span>
        </h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/reports")}>📄 Reports</li>
            <li className="active">👤 Profile</li>
            <li onClick={() => navigate("/calendar")}>🗓️ Calendar</li>
          </ul>
        </nav>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="profile-main">
        <div className="profile-header-new">
          <h1>{greeting}, <span>{user.name}</span> 👋</h1>
          <p>Manage and update your personal details below.</p>
        </div>

        <div className="profile-card">
          <div className="profile-left">
            <img
              src={profilePicFile ? URL.createObjectURL(profilePicFile) : user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="Profile"
              className="profile-avatar"
            />
            {editMode && (
              <input type="file" accept="image/*" onChange={handleFileChange} className="profile-file-input"/>
            )}
          </div>

          <div className="profile-right">
            <div className="field">
              <label>Name:</label>
              {editMode ? <input name="name" value={formData.name} onChange={handleChange} /> : <p>{user.name}</p>}
            </div>

            <div className="field">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>

            <div className="field">
              <label>Phone:</label>
              {editMode ? <input name="phone" value={formData.phone || ""} onChange={handleChange} /> : <p>{user.phone || "Not added"}</p>}
            </div>

            <div className="field">
              <label>Location:</label>
              {editMode ? <input name="location" value={formData.location || ""} onChange={handleChange} /> : <p>{user.location || "Not added"}</p>}
            </div>

            <div className="field">
              <label>Gender:</label>
              {editMode ? (
                <select name="gender" value={formData.gender || "Prefer not to say"} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : <p>{user.gender || "Prefer not to say"}</p>}
            </div>

            <div className="field">
              <label>Joined:</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="btn-group">
              {editMode ? (
                <>
                  <button className="save-btn" onClick={handleSave}>💾 Save</button>
                  <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
                </>
              ) : (
                <button className="edit-btn" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </main>

      {showToast && <div className={`toast-container ${toastType}`}><p>{toastMessage}</p></div>}
    </div>
  );
}

export default Profile;
