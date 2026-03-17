import { createContext, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-toastify";

export const GlobalContext = createContext(null);

function GlobalState({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  //////////////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////////////

  const loginUser = async (email, password) => {

    try {

      const res = await axios.post(`${server}/api/auth/login`, {
        email,
        password
      });

      const receivedToken = res.data.token;

      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);

      toast.success("Login successful");

      return true;

    } catch (error) {

      toast.error(error.response?.data?.message || "Login failed");
      return false;

    }
  };

  //////////////////////////////////////////////////
  // REGISTER
  //////////////////////////////////////////////////

  const registerUser = async (name, email, password) => {

    try {

      await axios.post(`${server}/api/auth/register`, {
        name,
        email,
        password
      });

      toast.success("Registered Successfully");

      return true;

    } catch (error) {

      toast.error(error.response?.data?.message || "Registration failed");
      return false;

    }
  };

  //////////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////////

  const logoutUser = () => {

    setToken("");
    setUser(null);
    localStorage.removeItem("token");

    toast.info("Logged out successfully");

  };

  //////////////////////////////////////////////////
  // GET PROFILE
  //////////////////////////////////////////////////

  const getProfile = async (authToken = token) => {

    try {

      const res = await axios.get(`${server}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      setUser(res.data);

    } catch (error) {

      toast.error("Failed to load profile");
      console.log(error);

    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        setToken,
        loginUser,
        registerUser,
        logoutUser,
        getProfile
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;