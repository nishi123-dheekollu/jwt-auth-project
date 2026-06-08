import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // ⏰ check expiry
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // API call
    axios.get("http://localhost:5000/dashboard", {
      headers: {
        authorization: token
      }
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard 🔐</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;