import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import defaultProfile from './default-profile.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/user/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          
          // Fetch profile photo
          try {
            const photoResponse = await fetch('http://localhost:5001/api/user/profile/photo', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
            if (photoResponse.ok) {
              const blob = await photoResponse.blob();
              const imageUrl = URL.createObjectURL(blob);
              setProfilePhoto(imageUrl);
            } else {
              setProfilePhoto(defaultProfile);
            }
          } catch (error) {
            console.error('Error fetching profile photo:', error);
            setProfilePhoto(defaultProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">Dashboard Keuangan</Link>
      </div>
      <div className="navbar-menu">
        {user && (
          <div className="user-menu">
            <div 
              className="user-profile" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="username">Hallo, {user.name}!</span>
              <img 
                src={profilePhoto || defaultProfile} 
                alt="Profile" 
                className="profile-picture"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfile;
                }}
              />
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Profil Saya</Link>
                <Link to="/categories" className="dropdown-item">Kategori</Link>
                <button onClick={handleLogout} className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 