import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../services/format.js';
import { Loader, ErrorMessage } from '../components/Status.jsx';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfile(data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (error) return <div className="container page"><ErrorMessage message={error} /></div>;
  if (!profile) return <div className="container page"><Loader /></div>;

  return (
    <div className="container page">
      <div className="card form-card">
        <h1>My Profile</h1>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Member since:</strong> {formatDate(profile.createdAt)}</p>
        <div className="button-row">
          <Link to="/orders" className="btn">My Orders</Link>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
