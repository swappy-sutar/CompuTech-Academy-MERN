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
import ContactUs from "./Pages/ContactUs";
import Dashboard from "./Pages/Dashboard";
import MyProfile from "./Components/core/Dashboard/MyProfile";
import Settings from "./Components/core/Dashboard/Settings";
import EnrolledCourse from "./Components/core/Dashboard/EnrolledCourse";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./Components/core/Dashboard/Cart";
import AddCourse from "./Components/core/Dashboard/AddCourse";
import MyCourses from "./Components/core/Dashboard/MyCourses";
import EditCourse from "./Components/core/Dashboard/EditCourse/Index"
import Catalog from "./Pages/Catalog";


function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />

        <Route path="error" element={<Error />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<ContactUs />} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourse />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />

              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourse />}
              />
            </>
          )}
        </Route>

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
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App
