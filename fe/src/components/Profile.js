import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "https://via.placeholder.com/150",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data);
      setFormData({
        ...formData,
        name: response.data.name,
        email: response.data.email,
      });
      if (response.data.avatar) {
        setPreviewUrl(response.data.avatar);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Gagal memuat profil");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Password baru tidak cocok");
          return;
        }
        formDataToSend.append("currentPassword", formData.currentPassword);
        formDataToSend.append("newPassword", formData.newPassword);
      }

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const response = await axios.put(
        `${API_URL}/api/user/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Profil berhasil diperbarui");
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.msg || "Gagal memperbarui profil");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        localStorage.removeItem("accessToken");
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        setError("Gagal menghapus akun");
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Profil Saya</h1>
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            Kembali ke Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <img
                src={previewUrl || user.avatar}
                alt="Profile"
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-upload">
                  <label htmlFor="avatar-upload" className="upload-button">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Nama</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password Saat Ini</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <label>Nama</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-actions">
                  <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profil
                  </button>
                  <button className="btn-delete" onClick={handleDeleteAccount}>
                    Hapus Akun
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
