import {Route, Routes} from "react-router-dom"
import './App.css'
import Home from "./Pages/Home";
import Navbar from "./Components/common/Navbar";
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import ForgotPassword from "./Pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import Error from "./Pages/Error";
import About from "./Pages/About";
import PrivateRoute from "./Components/core/Auth/PrivateRoute";


function App() {

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="error" element={<Error />} />
        <Route path="about" element={<About />} />
        <Route 
      element={
        <PrivateRoute>
          {/* <Dashboard /> */}
        </PrivateRoute>
      }
    />
      {/* <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/Settings" element={<Settings />} /> */}
        
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="error" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App
