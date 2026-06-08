import { MdEmail, MdPrivacyTip } from "react-icons/md";
import {FaLock, FaEye, FaEyeSlash, FaApple, FaMicrosoft, FaShieldAlt} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {BiSupport} from "react-icons/bi";
import "../App.css";
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {

  // Form data states
  const [islogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  //login 
  if (islogin) {
    setTimeout(() => {
    setLoginError("");
  }, 3000);

  try {
    const response = await axios.post("http://localhost:5000/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

     setLoginError("");
  
    setSuccess(response.data);
    setEmail("");
    setPassword("");

    navigate("/dashboard");
  } catch (error) {
    setSuccess("");
    setLoginError(error.response.data);
  }

  return;
}

  //sign up
  if (password !== confirmPassword) {
    setPasswordError("Passwords do not match");

    setTimeout(() => {
    setPasswordError("");
  }, 3000);
    return;
  }

  setPasswordError("");
  setEmailError("");
  setSuccess("");

  try {
  const response = await axios.post(
    "http://localhost:5000/signup",
    {
      name,
      email,
      password
    }
  );

  setSuccess(response.data);
  setTimeout(() => {
  setSuccess("");
}, 3000);

  setName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
  

} catch (error) {
    setSuccess("");
    setEmailError(error.response.data);

    setTimeout(() => {
    setEmailError("");
  }, 3000);
  }
};

  return (<div className="container">
    <div className="auth-wrapper">
    <div className="auth-card">
      
      {/* heding */}
      <h1 className="title">{islogin? "Welcome Back" : "Create Account"}</h1>

      <p className="subtitle">{islogin? "Login to continue your learning journey" : "Sign up to get started"}</p>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${islogin ? "active":""}`} onClick={() => setIsLogin(true)}>Login</button>
        <button className={`tab ${!islogin ? "active":""}`} onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>

      {/*Form */}
      <form className="form" onSubmit={handleSubmit}>
        
        {/* Signup form */}
        {!islogin &&(<div className = "form-label">
          <label>Full Name </label>
          <div className="input-box">
            <input type="text" placeholder="Enter your Full Name" className="input" value={name} 
            onChange={(e) => setName(e.target.value)}/>
          </div>
          </div>)
}
  

        <div className="form-label">
            <label >Email Address</label>
            <div className="input-box">
                <MdEmail className="icon"/> 
                <input type="email" placeholder="Enter your Email" className="input"  
                value={email} onChange={(e) => setEmail(e.target.value)}/>
             </div>
        </div>

         {!islogin && emailError && (<p className="error-message">{emailError}</p>)}

        <div className= "form-label">
            <label >Password</label>
            <div className="input-box">
                <FaLock className="icon"/> 
                <input type={showPassword ? "text" : "password"} placeholder="Enter your Password" className= "input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

            </div>
        </div>

        {/* signup for */}
        {!islogin &&(<div className="form-label">
          <label>Confirm Password</label>
          <div className= "input-box">
            <FaLock className="icon"/>
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your Password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
            </div>)} 

        {!islogin && ( passwordError && <p className="error-message">{passwordError}</p>)}
        
        {/* login form*/}
        {islogin &&(
        <div className="forgot-box">
          <p className="forgot-password">Forgot Password?</p>
        </div>)}

        {/* login form */}
        {islogin && (
          <button  type="submit" className="login-btn">Login</button>
        )}

        {islogin && ( loginError && <p className="loginerror-message">{loginError}</p>)}

        {/* signup form */}
        {!islogin && (<button  type="submit" className="login-btn">Sign Up</button>)}

         {!islogin && ( success && <p className="success-message">{success}</p>)}

      </form>

      {/*divider  */}
      <div className="divider">
        <hr className="divider-line"></hr>
        <span>or continue with</span>
        <hr className="divider-line"></hr>
      </div>

      {/* signup form */}
      {islogin && (
        <div className="signup-text">
          <p>Don't have an account? {" "}<span className="signup-link" onClick={() => setIsLogin(false)}>Sign Up</span></p>
        </div>
      )}

    </div>

     {/* footer */}
        <div className="footer">

          <div>
             <FaShieldAlt /> 
             <span>Secure & Safe</span>
          </div>
           
           <div>
             <MdPrivacyTip /> 
             <span>Privacy Protected</span>
          </div>

          <div>
             <BiSupport />
             <span>24/7 Support</span>
          </div>
        </div>
    </div>

  </div>);
}

export default Login;