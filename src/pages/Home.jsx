import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {FaBookOpen,FaCheckCircle,FaChartLine,FaFire} from "react-icons/fa";

{/* Dashboard home page */}
function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); {/* Get logged-in user information */}
  const hour = new Date().getHours();

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  let greeting = ""; {/* Display greeting based on current time */}
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  {/* Fetch user's learning progress from backend */}
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://learning-platform-muyw.onrender.com/api/progress/${userId}`
        );
        setProgressData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

 {/* Calculate dashboard statistics from progress data */}
  const totalTopics = {
    html5: 43, css3: 42, javascript: 45, gitgithub: 28,
    reactjs: 40, nodejs: 35, expressjs: 25, mongodb: 28,
    restapis: 20, jwtauthentication: 18
  };
  const grandTotal = 324;

  let completedCourses = 0;
  let totalCompletedTopics = 0;

  {/* Count completed courses and topics */}
  if (progressData?.courses) {
    Object.entries(progressData.courses).forEach(([key, val]) => {
      if (val?.completed) completedCourses++;
      totalCompletedTopics += (val?.completedTopics?.length || 0);
    });
  }

  { /* Calculate overall learning progress percentage */ }
  const overallProgress = grandTotal > 0
    ? Math.round((totalCompletedTopics / grandTotal) * 100)
    : 0;

  const streakCount = progressData?.streakCount || 0;  // Get current learning streak

  return (
    <div className="home-page">
    {/* Sidebar Navigation */} 
      <Sidebar />

      <div className="hero">
        {/* Welcome section with personalized greeting */} 
        <div className="top-header">
          <div className="welcome-section">
            <h1>{greeting}, {user?.name}</h1>
            <p>Continue your MERN Stack learning journey today.</p>
          </div>

          <div className="profile-mini">
            <div className="mini-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4>{user?.name}</h4>
              <span>Active Learner</span>
            </div>
          </div>
        </div>

        { /* Dashboard statistics cards */} 
        <div className="stats-container">

  {/* Total Courses */}
  <div className="home-stat-card">

    <div className="mobile-row">

      <div className="mobile-left">
        <div className="mobile-card-icon">
          <FaBookOpen />
        </div>

        <span>Total Courses</span>
      </div>

      <h2>10</h2>

    </div>

  </div>

  {/* Completed Courses */}
  <div className="home-stat-card">

    <div className="mobile-row">

      <div className="mobile-left">
        <div className="mobile-card-icon">
          <FaCheckCircle />
        </div>

        <span>Completed Courses</span>
      </div>

      <h2>{loading ? "..." : completedCourses}</h2>

    </div>

  </div>

  {/* Learning Progress */}
  <div className="home-stat-card">

    <h3>Learning Progress</h3>

    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${overallProgress}%` }}
      ></div>
    </div>

    <p>
      {loading ? "Loading..." : `${overallProgress}% Completed`}
    </p>

  </div>

  {/* Learning Streak */}
  <div className="home-stat-card">

    <div className="mobile-row">

      <div className="mobile-left">
        <div className="mobile-card-icon">
          <FaFire />
        </div>

        <span>Learning Streak</span>
      </div>

      <h2>
        {loading
          ? "..."
          : `${streakCount} ${streakCount === 1 ? "Day" : "Days"}`}
      </h2>

    </div>

  </div>

</div>

        <h2 className="section-title">MERN Stack Learning Roadmap</h2>

       { /* MERN Stack learning roadmap banner */ }
        <div className="hero-banner">
          <h2>Complete MERN Roadmap</h2>
          <div className="roadmap-points">
            <p>✓ Frontend Development</p>
            <p>✓ Backend Development</p>
            <p>✓ MongoDB Database</p>
            <p>✓ JWT Authentication</p>
            <p>✓ Deployment</p>
          </div>
          <button
            className="start-learning-btn"
            onClick={() => navigate("/mycourses")}
          >
            Start Your Journey →
          </button>
        </div>

        { /* Daily motivation section */} 
        <div className="quote-card">
          <h3>💡 Daily Motivation</h3>
          <p>Consistency beats talent when talent doesn't work hard.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;