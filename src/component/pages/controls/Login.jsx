import React, { useCallback, useState } from "react";
import "../controls/login.css";
import { LuBoxes } from "react-icons/lu";
import axios from "axios";
import { apiUrl } from "../../../api-services/apiContents";
import { useAdminDataContext } from "../../../utilities/adminData";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminData, setAdminData } = useAdminDataContext();
  const [showPassword, setShowPassword] = useState(false);
  console.log("adminData", adminData);

  const handleLogin = useCallback(async () => {
    if (!mobileNumber || !password) {
      alert("Mobile and Password are required");
      return;
    }

    if (loading) return; // ✅ avoid double calls
    setLoading(true);

    try {
      const config = {
        url: apiUrl.TEAM_USER_LOGIN,
        method: "post",
        baseURL: apiUrl.BASEURL,
        headers: { "Content-Type": "application/json" },
        data: {
          mobile_number: mobileNumber,
          password: password,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        alert(response.data.message || "Login Success");
        console.log("login details", response.data.user);
        setAdminData(response.data.user);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.assign("/welcome");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Login failed";
      console.log("catch error:", error.response?.data?.message);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mobileNumber, password, loading, setAdminData]);

  const handleEnterToLogin = (e) => {
    console.log("keydown:", e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="row me-0" style={{ marginTop: "80px" }}>
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <div className="text-center">
          {/* <img
            src="http://ecartvendor.wrteam.co.in/dist/img/logo.png"
            height="110"
          /> */}
          <h3 style={{ fontSize: "30px" }}>
            {" "}
            <LuBoxes size={25} color="#609ecc" /> Nithyaevent
          </h3>
          {/* <h3 style={{ fontSize: "22px" }}>Multiuser - Dashboard</h3> */}
        </div>
        <div className="box box-info">
          <div className="box-header with-border">
            <h3 className="box-title">Administrator Login</h3>
            <center>
              <div className="msg"></div>
            </center>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label for="exampleInputEmail1">Mobile Number :</label>
              <input
                type="tel"
                className="form-control"
                value={mobileNumber}
                maxLength={10}
                onChange={(e) => setMobileNumber(e.target.value)}
                // onKeyDown={handleEnterToLogin}
              />
            </div>
            <div style={{ position: "relative" }}>
              <label for="exampleInputEmail1">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                // onKeyDown={handleEnterToLogin}
                placeholder="Password"
                style={{ paddingRight: 42 }}
              />

              <span
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "71%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash size={16} color="black" />
                ) : (
                  <FaEye size={16} color="black" />
                )}
              </span>
            </div>

            <div className="box-footer">
              <button
                className="btn btn-info pull-left"
                onClick={handleLogin}
                disabled={loading}
                style={{ marginTop: 12 }}
              >
                {loading ? "Loging in..." : "Login"}
              </button>
              {/* <a
                href="forgot-password.php"
                className="pull-right"
                style={{ fontSize: "14px" }}
              >
                Forgot Password?
              </a> */}
            </div>
          </form>
        </div>
      </div>
      <div className="col-md-4"></div>
    </div>
  );
}

export default Login;
