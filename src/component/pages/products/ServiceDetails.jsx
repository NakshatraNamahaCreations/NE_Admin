import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import ReactPlayer from "react-player";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Switch from "react-switch";
import { apiUrl } from "../../../api-services/apiContents";

function ServiceDetails() {
  const location = useLocation();
  const service = location.state?.service || null;
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  console.log("SERVICE", service);

  const makeServiceApproval = async () => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.SERVICE_APPROVE}${service?._id}`,
      );
      if (res.status === 200) {
        console.log(res.data);
        alert("Approved Successfully");
        navigate(-1);
        // window.location.assign("/vendor/vendor-profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openPop = () => setShowModal(true);

  const makeServiceDisapproval = async () => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.SERVICE_DISAPPROVE}${service?._id}`,
        {
          reason_for_disapprove: reason,
        },
      );
      if (res.status === 200) {
        console.log(res.data);
        alert("Disapproved Successfully");
        navigate(-1);
        // window.location.assign("/vendor/vendor-profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const toggleServiceStatus = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.PRODUCT_STATUS_CHANGE}${id}`,
        {
          isActive: !currentStatus, // Toggle the current status
        },
      );
      if (res.status === 200) {
        alert(`Product is ${currentStatus ? "Inactivated" : "Activated"}`);
        navigate(-1);
        // fetchVendors(); // Refresh the service list
      }
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  return (
    <div
      className="px-3"
      style={{
        backgroundColor: "white",
        borderRadius: "24px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e4e4e4",
        }}
      >
        <div
          className="p-2"
          style={{
            border: "1px solid #e4e4e4",
            cursor: "pointer",
            borderRadius: "7px",
          }}
          onClick={() => navigate(-1)}
        >
          <IoMdArrowBack color="#4b4b4b" />
        </div>
        <div style={{ marginTop: "20px", marginLeft: "12px" }}>
          <div
            style={{ fontSize: "14px", color: "#636870", fontWeight: "500" }}
          >
            {/* Back to vendor */}
          </div>
          <div
            className="pb-3"
            style={{ color: "black", fontSize: "23px", fontWeight: "bold" }}
          >
            {service?.service_name}
          </div>
        </div>
      </div>

      <div className="row ps-4 pb-4">
        <div className="col-md-6">
          <div style={Styles.labelTitle}>Service Details</div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div>
              <div style={Styles.labelTitleSmall}>Service Name:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {service?.service_name}{" "}
              </div>
            </div>
            <div>
              <div style={Styles.labelTitleSmall}>Service Category:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {service?.service_category}{" "}
              </div>
            </div>
            <div>
              <div style={Styles.labelTitleSmall}>Service Description:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {service?.service_description}{" "}
              </div>
            </div>
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            General Details
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Price:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {service?.price}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div style={Styles.labelTitle}>Service Images</div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div className="row">
              {service?.additional_images &&
                service?.additional_images.map((image, index) => (
                  <div key={index} className="col-md-4 mb-2">
                    <img
                      src={image}
                      alt="product image"
                      style={{ width: "80%", height: "100px" }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {service?.approval_status === "Under Review" && (
          <>
            <button
              style={{
                backgroundColor: "#0d6efd",
                border: 0,
                color: "white",
                borderRadius: "3px",
                padding: "5px 10px",
              }}
              onClick={openPop}
            >
              Disapprove
            </button>{" "}
            <button
              style={{
                backgroundColor: "#0d6efd",
                border: 0,
                color: "white",
                borderRadius: "3px",
                padding: "5px 10px",
                marginLeft: 10,
              }}
              onClick={makeServiceApproval}
            >
              Approve
            </button>
          </>
        )}
        {service?.approval_status === "Disapproved" && (
          <button
            style={{
              backgroundColor: "#0d6efd",
              border: 0,
              color: "white",
              borderRadius: "3px",
              padding: "5px 10px",
            }}
            onClick={makeServiceApproval}
          >
            Approve
          </button>
        )}
        {service?.approval_status === "Approved" && (
          <button
            style={{
              backgroundColor: "#0d6efd",
              border: 0,
              color: "white",
              borderRadius: "3px",
              padding: "5px 10px",
            }}
            onClick={openPop}
          >
            Disapprove
          </button>
        )}
        {service.approval_status === "Approved" && (
          <div className="ms-3">
            {/* <lable
              style={{ color: "#333", fontSize: "14px", fontWeight: "600" }}
            >
              <span
                style={{
                  color: service.isActive ? "#35d482" : "red",
                  // fontSize: "20px",
                }}
              >
                {service.isActive ? "Active" : "In Active"}{" "}
              </span>{" "}
            </lable> */}
            {/* <span>
              <Switch
                className="mt-2"
                onChange={() =>
                  toggleServiceStatus(product._id, product.isActive)
                }
                checked={product.isActive}
                onColor="#080"
                offHandleColor="#ddd"
                onHandleColor="#ddd"
                offColor="#888"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                height={15}
                width={35}
              />
            </span> */}
          </div>
        )}
      </div>
      <Modal
        size="sm"
        centered
        onHide={() => setShowModal(false)}
        show={showModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Disapprove Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Reason for disapproval
            <span style={{ color: "Red" }}> *</span>
            <textarea
              className="input-0-1-134 my-2 input-d21-0-1-1124 undefined"
              type="text"
              style={{ borderRadius: "7px" }}
              onChange={(e) => setReason(e.target.value)}
            />{" "}
            <Button
              style={{
                border: 0,
                fontSize: "14px",
                backgroundColor: "#ff005d",
                color: "white",
                borderRadius: "7px",
                boxShadow: "0px 1px 3px 0px #5d5d5d",
              }}
              onClick={makeServiceDisapproval}
            >
              Disapprove
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
const Styles = {
  labelTitle: {
    fontSize: "15px",
    color: "black",
    fontWeight: "bold",
    marginTop: "12px",
  },
  labelTitleSmall: {
    fontSize: "14px",
    color: "#636870",
    fontWeight: "500",
  },
  details: {
    fontSize: "15px",
    fontWeight: "500",
    margin: "7px 0px",
    border: "1px solid #e4e4e4",
    borderRadius: "7px",
  },
};

export default ServiceDetails;
