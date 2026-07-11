import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {FaBook,FaRobot,FaGraduationCap,FaChartLine} from "react-icons/fa";
import { FiEdit2, FiMenu } from "react-icons/fi";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";


// Profile page
function Profile() {
  // Store profile data
  const [profile, setProfile] = useState(null);
  // Edit profile modal visibility
  const [showEdit, setShowEdit] = useState(false);
   // Change password modal visibility
  const [showPasswordModal, setShowPasswordModal] = useState(false);

   // Fetch profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `https://learning-platform-muyw.onrender.com/api/profile/${userId}`
        );

        setProfile(response.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="home-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="hero">
        {/* Page Header */}
        <div className="profile-header">

          <h1>My Profile</h1>

        </div>
        
        {/* Show loading until profile data arrives */}
        {!profile ? (

          <h2>Loading...</h2>

        ) : (

          <div className="profile-container">
   
           {/* Profile Card */}
            <div className="profile-card">

             {/* User Avatar & Basic Information */}
              <div className="profile-top">
                <button
                className="edit-profile-btn"
                onClick={() => setShowEdit(true)}
              >
              <FiEdit2 />
              </button>

                 <div className="avatar">
  {profile?.name?.charAt(0).toUpperCase()}
                 </div>

                <div className="profile-details">
  <h2>{profile?.name}</h2>

  <p className="role">
    Full Stack Learner 
  </p>

  <p className="email">
    {profile?.email}
  </p>
               </div>

              </div>

           <div className="stats-wrapper">
              <h3 className="stats-title">
                📚 Learning Statistics
              </h3>

              {/* Learning Statistics */}
              <div className="profile-stats">

                <div className="profile-stat-card">

                  <FaBook className="stat-icon" />

                  <h3>{profile.coursesCompleted}</h3>

                  <p>Courses Completed</p>

                </div>

                <div className="profile-stat-card">

                  <FaChartLine className="stat-icon" />

                  <h3>{profile.overallProgress}%</h3>

                  <p>Overall Progress</p>

                </div>

                <div className="profile-stat-card">

                  <FaRobot className="stat-icon" />

                  <h3>{profile.aiChats}</h3>

                  <p>AI Conversations</p>

                </div>

                <div className="profile-stat-card">

                  <FaGraduationCap className="stat-icon" />

                  <h3>Coming Soon</h3>

                  <p>Certificates</p>

                </div>

              </div>

              <hr className="profile-divider" />

              {/* Change Password Modal */}
              <button
                className="change-password-full-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                🔒 Change Password
              </button>

           </div>

          </div>
          
</div>

        )}

        <EditProfileModal
          profile={profile}
          setProfile={setProfile}
          showEdit={showEdit}
          setShowEdit={setShowEdit}
        />

        <ChangePasswordModal
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
        />

      </div>

    </div>
  );
}

export default Profile;