import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {FaLock, FaCheckCircle} from "react-icons/fa";
import {MdPlayArrow} from "react-icons/md";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { htmlLessons, htmlTopics } from "../data/htmlLessons";
import { cssLessons, cssTopics } from "../data/cssLessons";
import { jsLessons, jsTopics } from "../data/jsLessons";
import { gitLessons, gitTopics } from "../data/gitLessons";
import { nodeLessons, nodeTopics } from "../data/nodeLessons";
import { reactLessons, reactTopics } from "../data/reactLessons";
import { expressLessons, expressTopics } from "../data/expressLessons";
import { mongoLessons, mongoTopics } from "../data/mongoLessons";
import { jwtLessons, jwtTopics } from "../data/jwtLessons";
import { restLessons, restTopics } from "../data/restLessons";
import axios from "axios";

const courseLessonsMap = {
  html5: htmlLessons,
  css3: cssLessons,
  javascript: jsLessons,
  gitgithub: gitLessons,
  reactjs: reactLessons,
  nodejs: nodeLessons,
  expressjs: expressLessons,
  mongodb: mongoLessons,
  restapis: restLessons,
  jwtauthentication: jwtLessons
};

const courseTopicsMap = {
  html5: htmlTopics,
  css3: cssTopics,
  javascript: jsTopics,
  gitgithub: gitTopics,
  reactjs: reactTopics,
  nodejs: nodeTopics,
  expressjs: expressTopics,
  mongodb: mongoTopics,
  restapis: restTopics,
  jwtauthentication: jwtTopics
};

// Course Details page - Displays course lessons and tracks user progress
function CourseDetails() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [completedTopics, setCompletedTopics] = useState([]); // Stores completed topics fetched from database
  const [currentTopic, setCurrentTopic] = useState(0); // Stores currently selected lesson
  const [searchQuery, setSearchQuery] = useState("");  // Search bar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Load lessons and topics based on selected course
  const lessons = courseLessonsMap[courseName] || [];
  const lesson = lessons[currentTopic];

  const topics = courseTopicsMap[courseName] || [];

// Fetch user's saved course progress from MongoDB
useEffect(() => {

  const fetchProgress = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const response = await axios.get(
        `https://learning-platform-muyw.onrender.com/api/progress/${userId}`
      );

      const course =
        response.data.courses?.[courseName];

      if (course) {

        setCompletedTopics(course.completedTopics || []);

        setCurrentTopic(course.currentTopic || 0);

      }

    } catch (error) {

      console.log(error);

    }

  };

  fetchProgress();

}, [courseName]);

// Mark current topic as completed and save progress
const handleComplete = async () => {

  let updatedTopics = [...completedTopics];

  if (!updatedTopics.includes(currentTopic)) {
    updatedTopics.push(currentTopic);
  }

  setCompletedTopics(updatedTopics);

  // Progress percentage
  const progress =
    Math.round(
      (updatedTopics.length /
        topics.length) * 100
    );

  // MongoDB save
  try {

    const userId =
      localStorage.getItem("userId");

    await axios.put(
      `https://learning-platform-muyw.onrender.com/api/progress/${courseName}/${userId}`,
      {
        completedTopics: updatedTopics,
        currentTopic: currentTopic,
        progress
      }
    );

    console.log("Progress saved");

  } catch (error) {

    console.log(error);

  }

};

// Move to next topic only after completing current topic
const handleNext = () => {

 
  if (!completedTopics.includes(currentTopic)) {
    alert("Please complete this topic first.");
    return;
  }

  if (currentTopic < topics.length - 1) {
    setCurrentTopic(currentTopic + 1);
    setSidebarOpen(false);
  }

};

// Navigate to previous lesson
const handlePrevious = () => {
  if (currentTopic > 0) {
    const prevTopic = currentTopic - 1;
    setCurrentTopic(prevTopic);
    setSidebarOpen(false);
  }
};

if (!lesson) {
  return (
    <div className="home-page">
      <p style={{ padding: "50px" }}>
        Course content not available yet. Please go back to "My Courses".
      </p>
    </div>
  );
}

  return (

      <div className="home-page">

        <div className="course-mobile-header">

  <button
    className="course-menu-btn"
    onClick={() => setSidebarOpen(true)}
  >
    <FiMenu />
  </button>

  <h2>{courseName.toUpperCase()}</h2>

</div>

  {/* Sidebar */}
  <div className={`course-sidebar ${sidebarOpen ? "show-course-sidebar" : ""}`}>
    
<div className="course-sidebar-top">

   <button
    className="close-sidebar-btn"
    onClick={() => setSidebarOpen(false)}
  >
    <FiX />
  </button>

  <div
    className="back-btn"
    onClick={() => navigate("/MyCourses")}
  >
    ← Back
  </div>

    <div
  className="back-btn"
  onClick={() => navigate("/MyCourses")}>← Back
</div>

{/* Filter topics based on search input */}
<div className="search-container">
  <FiSearch className="search-icon"/>

  <input
    type="text"
    placeholder="Search Topics..."
    className="search-bar"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

</div>


{topics
  .map((topic, index) => ({ topic, index }))
  .filter(({ topic }) =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map(({ topic, index }) => {

  const isCompleted =
    completedTopics.includes(index);

  const isCurrent =
    currentTopic === index;

  const isLocked = !completedTopics.includes(index) && index !== currentTopic;

  return (
    <div
  key={index}
  className={`
    topic
    ${isCompleted ? "completed" : ""}
    ${isCurrent ? "topic-active" : ""}
    ${isLocked ? "locked" : ""}
  `}
  onClick={() => {

  if (completedTopics.includes(index) || index === currentTopic) {
    setCurrentTopic(index);
    setSidebarOpen(false);
  }

  }}
>
  <span>{topic}</span>

  {isCompleted && !isCurrent && (
    <FaCheckCircle className="completed-icon" />
  )}

   {isLocked && (
    <FaLock className="lock-icon" />
  )}
</div>
  );
})}

  </div>

  {/* Main Content */}
 <div className="hero">

  <div className="lesson-header">

    <p className="lesson-number">
      Topic {currentTopic + 1} of {topics.length}
    </p>

    <h1>{lesson.title}</h1>

    <p className="lesson-subtitle">
      {lesson.subtitle}
    </p>

  </div>

  <div className="lesson-content">

    {lesson.sections.map((section, index) => (

      <div key={index} className="lesson-section">

        <h2>{section.heading}</h2>

        {section.paragraphs &&
          section.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}

        {section.points && (
          <ul>
            {section.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}

        {section.code && (
          <pre className="code-block">
            <code>{section.code}</code>
          </pre>
        )}

      </div>

    ))}

  </div>

  <button
    className="complete-btn"
    onClick={handleComplete}
  >
    Mark as Complete
  </button>

  <div className="lesson-nav-buttons">
    {currentTopic > 0 && (
      <button
        className="nav-btn prev-btn"
        onClick={handlePrevious}
      >
        ← Previous Topic
      </button>
    )}

    {currentTopic < topics.length - 1 && (
      <button
        className="nav-btn next-btn"
        onClick={handleNext}
      >
        Next Topic →
      </button>
    )}
  </div>

</div>

      </div>
  );
}

export default CourseDetails;