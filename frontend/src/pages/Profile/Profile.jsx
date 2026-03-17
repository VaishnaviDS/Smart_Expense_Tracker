import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/UserContext";
import "./Profile.css";

function Profile() {

  const { user, token, getProfile ,logoutUser} = useContext(GlobalContext);

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);
    const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-item">
                        <span>Name</span>
            <strong>{user.name}</strong>
          </div>
                    <div className="profile-item">
                        <span>E-mail</span>
            <strong>{user.email}</strong>
          </div>
          <div className="profile-item">
            <span>Member Since</span>
            <strong>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </strong>
          </div>

          {/* <div className="profile-item">
            <span>User ID</span>
            <strong>{user._id}</strong>
          </div> */}
          <div className="Profile-logout">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;