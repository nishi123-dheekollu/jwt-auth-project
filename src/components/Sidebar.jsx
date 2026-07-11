import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaRobot, FaUser } from "react-icons/fa";
import { useState } from "react";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>

      {/* Mobile Header */}
      <div className="mobile-header">

  <button
    className="menu-btn"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </button>

  <h2>EduNexa</h2>

</div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "show-sidebar" : ""}`}>

        <div>

          <h2>EduNexa</h2>

          <p className="tagline">
            Learn • Grow • Master
          </p>

          <ul>

            <li
              className={location.pathname === "/home" ? "active" : ""}
              onClick={() => {
                navigate("/home");
                setMenuOpen(false);
              }}
            >
              <FaHome />
              <span>Home</span>
            </li>

            <li
              className={location.pathname === "/mycourses" ? "active" : ""}
              onClick={() => {
                navigate("/mycourses");
                setMenuOpen(false);
              }}
            >
              <FaBook />
              <span>My Courses</span>
            </li>

            <li
              className={location.pathname === "/aimentor" ? "active" : ""}
              onClick={() => {
                navigate("/aimentor");
                setMenuOpen(false);
              }}
            >
              <FaRobot />
              <span>AI Mentor</span>
            </li>

            <li
              className={location.pathname === "/profile" ? "active" : ""}
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
            >
              <FaUser />
              <span>Profile</span>
            </li>

          </ul>

        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        >
          Logout
        </button>

      </div>

    </>
  );
}

export default Sidebar;