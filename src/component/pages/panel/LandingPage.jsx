import axios from "axios";
import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { apiUrl } from "../../../api-services/apiContents";
import { useAdminDataContext } from "../../../utilities/adminData";

function LandingPage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { adminData, setAdminData } = useAdminDataContext();
  const [password, setPassword] = useState(adminData?.password || "");
  const [openPopUp, setOpenPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log("adminData", adminData);

  const editPassword = async () => {
    setLoading(true);
    try {
      const config = {
        url: `${apiUrl.UPDATE_PASSWORD}${user._id}`,
        method: "put",
        baseURL: apiUrl.BASEURL,
        headers: { "Content-Type": "application/json" },
        data: {
          password: password,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        alert(response.data.message || "Password Updated!");
        // console.log("Update password", response.data.data);
        setAdminData(response.data.data);
        setOpenPopUp(false);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Fail to update";
      console.log("catch error:", error.response?.data?.message);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#3779eb",
          }}
          onClick={() => setOpenPopUp(true)}
        >
          My Profile{" "}
        </p>
      </div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          height: "100vh",
        }}
      >
        <h2>Welcome! {adminData ? adminData?.member_name : ""}</h2>
      </div>
      <Offcanvas
        show={openPopUp}
        placement="end"
        onHide={() => setOpenPopUp(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <label>Name</label> <br />
          <input disabled value={adminData ? adminData.member_name : ""} />{" "}
          <br />
          <br />
          <label>Mobile Number</label> <br />
          <input
            disabled
            value={adminData ? adminData.mobile_number : ""}
          />{" "}
          <br />
          <br />
          <label>Email</label> <br />
          <input disabled value={adminData ? adminData.email_id : ""} /> <br />
          <br />
          <label>Password</label> <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <br />
          <Button onClick={loading ? null : editPassword}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default LandingPage;
