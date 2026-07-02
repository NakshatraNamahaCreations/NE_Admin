import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import ReactPlayer from "react-player";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Switch from "react-switch";
import { apiUrl } from "../../../api-services/apiContents";
import { useConfirm } from "../../common/ConfirmProvider";
import { FaDownload, FaEye } from "react-icons/fa";

function ServiceDetails() {
  const location = useLocation();
  const service = location.state?.service || null;
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const downloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const extension = blob.type.split("/")[1] || "jpg";
      link.download = `${service?.service_name || "service"}-image-${index + 1}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback: open the image in a new tab
      window.open(imageUrl, "_blank");
    }
  };

  const makeServiceApproval = async () => {
    const ok = await confirm({
      title: "Approve Service",
      message: "Are you sure you want to approve this service?",
      confirmText: "Yes, Approve",
      cancelText: "No",
      variant: "success",
    });
    if (!ok) return;
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
    if (!reason.trim()) {
      alert("Please provide a reason for disapproval.");
      return;
    }
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.SERVICE_DISAPPROVE}${service?._id}`,
        {
          reason_for_disapprove: reason,
        },
      );
      if (res.status === 200) {
        alert("Disapproved Successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const toggleServiceStatus = async (id, currentStatus) => {
    const next = !currentStatus;
    const ok = await confirm({
      title: `${next ? "Activate" : "Deactivate"} Service`,
      message: `Are you sure you want to change the status to ${next ? "Active" : "Inactive"}?`,
      confirmText: "Yes",
      cancelText: "No",
      variant: next ? "success" : "warning",
    });
    if (!ok) return;
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.PRODUCT_STATUS_CHANGE}${id}`,
        {
          isActive: next,
        },
      );
      if (res.status === 200) {
        alert(`Product is ${currentStatus ? "Inactivated" : "Activated"}`);
        navigate(-1);
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
              service?.additional_images.length > 0 ? (
                service?.additional_images.map((image, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "7px",
                        overflow: "hidden",
                        border: "1px solid #e4e4e4",
                      }}
                    >
                      <img
                        src={image}
                        alt={`service image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => setPreviewImage(image)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <div
                          title="View"
                          onClick={() => setPreviewImage(image)}
                          style={{
                            backgroundColor: "rgba(47, 78, 158, 0.9)",
                            padding: "5px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <FaEye size={13} color="#ffffff" />
                        </div>
                        <div
                          title="Download"
                          onClick={() => downloadImage(image, index)}
                          style={{
                            backgroundColor: "rgba(25, 135, 84, 0.9)",
                            padding: "5px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <FaDownload size={13} color="#ffffff" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2" style={Styles.labelTitleSmall}>
                  No images uploaded.
                </div>
              )}
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

      <Modal
        size="lg"
        centered
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Service Image</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="service preview"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() =>
              downloadImage(
                previewImage,
                service?.additional_images?.indexOf(previewImage) ?? 0,
              )
            }
          >
            <FaDownload className="me-2" size={13} />
            Download
          </Button>
          <Button variant="secondary" onClick={() => setPreviewImage(null)}>
            Close
          </Button>
        </Modal.Footer>
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
