import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

const Register = () => {
    const {registerUser}=useContext(GlobalContext)
    const navigate=useNavigate()

    const [name,setName]=useState("");
      const [email,setEmail] = useState("");
      const [password,setPassword] = useState("");

        const handleSubmit = async (e)=>{
    e.preventDefault();

    await registerUser(name,email,password);

    navigate("/login"); // redirect after login
  }

  return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
      />

      <button type="submit">Register</button>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  </div>
);
}

export default Register