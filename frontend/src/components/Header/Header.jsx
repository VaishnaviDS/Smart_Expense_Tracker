import { useContext } from "react";
import { GlobalContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import './Header.css'

const Header = () => {

  const { token, logoutUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <div className="logo">SmartExpense</div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transaction">Transactions</Link>
          </>
        )}
      

      <div className="auth-buttons">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
          <Link className="profile-nav" to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
          </>

        )}
      </div>
      </nav>
    </header>
  );
};
export default Header