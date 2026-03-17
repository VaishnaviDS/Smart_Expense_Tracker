import { useContext, useState } from "react";
import { GlobalContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {

  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e)=>{
    e.preventDefault();

    await loginUser(email,password);

    navigate("/dashboard"); // redirect after login
  }

  return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </form>
  </div>
);
}

export default Login;