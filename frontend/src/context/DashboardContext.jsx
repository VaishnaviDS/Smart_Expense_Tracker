import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { server } from "../main";
import { GlobalContext } from "./UserContext";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {

  const { token } = useContext(GlobalContext);

  const API = `${server}/api/transaction/dashboard`;

  const [dashboardData, setDashboardData] = useState(null);
  const [year, setYear] = useState(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async (selectedYear = year, selectedPeriod = period) => {

    if (!token) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}?year=${selectedYear || ""}&period=${selectedPeriod}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDashboardData(res.data);

      if (!selectedYear && res.data.availableYears?.length > 0) {
        setYear(res.data.availableYears[0]);
      }

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token, year, period]);

  const refreshDashboard = () => {
    fetchDashboard();
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        year,
        setYear,
        period,
        setPeriod,
        loading,
        refreshDashboard
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;