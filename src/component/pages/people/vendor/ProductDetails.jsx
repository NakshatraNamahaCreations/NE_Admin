import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { apiUrl } from "../../../../api-services/apiContents";
import ReactPlayer from "react-player";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Switch from "react-switch";
import { useConfirm } from "../../../common/ConfirmProvider";

function ProductDetails() {
  const location = useLocation();
  const product = location.state?.prooduct || null;
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const makeProductApproval = async () => {
    const ok = await confirm({
      title: "Approve Product",
      message: "Are you sure you want to approve this product?",
      confirmText: "Yes, Approve",
      cancelText: "No",
      variant: "success",
    });
    if (!ok) return;
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.PRODUCT_APPROVE}${product?._id}`,
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

  const makeProductDisapproval = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for disapproval.");
      return;
    }
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.PRODUCT_DISAPPROVE}${product?._id}`,
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
      title: `${next ? "Activate" : "Deactivate"} Product`,
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
  const [galleryImages, setGalleryImages] = useState([]);

  const handleDocumentUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "image") {
      setGalleryImages(files);
    }
  };

  const addImages = async () => {
    try {
      const formData = new FormData();
      galleryImages.forEach((file, index) => {
        formData.append("images", file, file.name);
      });

      const config = {
        url: `${apiUrl.ADD_PRODUCT_IMAGES}${product._id}`,
        method: "put",
        baseURL: apiUrl.BASEURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };

      const response = await axios(config);

      if (response.status === 200) {
        alert(response.data.message);
        console.log("Response:", response.data);
        navigate(-1);
      } else {
        alert("Error", "Error while adding product");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          alert(
            "Error",
            error.response.data.message || "Error while adding product",
          );
        } else if (error.request) {
          console.error("Request data:", error.request);
          alert("Error", "No response received from server");
        }
      } else {
        console.error("Unknown error:", error);
        alert("Error", "An unknown error occurred");
      }
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
            {product?.product_name}
          </div>
          {/* add product image */}
          {/* <div>
            <input
              className="mb-1"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              id="icon-button-file"
              type="file"
              multiple
              onChange={(e) => handleDocumentUpload(e, "image")}
            />{" "}
            <button
              onClick={addImages}
              style={{
                backgroundColor: "#609ecc",
                border: "#7ac536",
                color: "white",
                borderRadius: "3px",
                fontSize: "14px",
                padding: "5px 10px",
              }}
            >
              Add Image
            </button>
          </div> */}
        </div>
      </div>

      <div className="row ps-4 pb-4">
        <div className="col-md-6">
          <div style={Styles.labelTitle}>Product Details</div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div>
              <div style={Styles.labelTitleSmall}>Product Name:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {product?.product_name}{" "}
              </div>
            </div>
            <div>
              <div style={Styles.labelTitleSmall}>Product Type:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {product?.product_type}{" "}
              </div>
            </div>
            <div>
              <div style={Styles.labelTitleSmall}>Product Category:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {product?.product_category}{" "}
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
                <div style={Styles.labelTitleSmall}>Model Name:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.model_name}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Brand:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.brand}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Material Type:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.material_type ? product?.material_type : "NA"}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Product Color:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.product_color ? product?.product_color : "NA"}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Warrenty Type:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.warranty ? product?.warranty : "NA"}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            Manufacturing
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div>
              <div style={Styles.labelTitleSmall}>Manufacuturer:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {product?.manufacturer_name
                  ? product?.manufacturer_name
                  : "NA"}{" "}
              </div>
            </div>
            <div>
              <div style={Styles.labelTitleSmall}>Country of Orgin:</div>
              <div className="px-3 py-2" style={Styles.details}>
                {product?.country_of_orgin
                  ? product?.country_of_orgin
                  : "NA"}{" "}
              </div>
            </div>
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            Description
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            {" "}
            <div className="px-3 py-2" style={Styles.details}>
              {product?.product_description
                ? product?.product_description
                : "NA"}{" "}
            </div>
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            Specifications
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            {Array.isArray(product?.Specifications) &&
            product.Specifications.length > 0 ? (
              product.Specifications.map((ele, index) => {
                const name = ele?.name || ele?.selectItem || "";
                const value = ele?.value || ele?.ItemSpecification || "";
                if (!name && !value) return null;
                return (
                  <div key={index}>
                    <div style={Styles.labelTitleSmall}>{name}</div>
                    <div className="px-3 py-2" style={Styles.details}>
                      {value || "NA"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2" style={Styles.details}>
                No specifications added
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div style={Styles.labelTitle}>Product Images</div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div className="row">
              {product?.product_image &&
                product?.product_image.map((image, index) => (
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
          <div style={Styles.labelTitle}>Product Video</div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <ReactPlayer
              url={product?.product_video}
              width={460}
              height={223}
              controls={true}
            />
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            Measurements
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Item Weight:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.product_weight}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Dimension:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.product_dimension}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4" style={Styles.labelTitle}>
            Pricing
          </div>
          <div
            className="py-2 px-3 mt-1"
            style={{ border: "1px solid #e4e4e4", borderRadius: "7px" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Price:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  ₹ {product?.product_price}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>MRP Rate:</div>
                <div className="px-3 py-2" style={Styles.details}>
                  ₹ {product?.mrp_rate}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Discount</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.discount}%{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div style={Styles.labelTitleSmall}>Warranty</div>
                <div className="px-3 py-2" style={Styles.details}>
                  {product?.warranty ? product.warranty : "NA"}{" "}
                </div>
              </div>
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
        {product?.approval_status === "Under Review" && (
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
              onClick={makeProductApproval}
            >
              Approve
            </button>
          </>
        )}
        {product?.approval_status === "Disapproved" && (
          <button
            style={{
              backgroundColor: "#0d6efd",
              border: 0,
              color: "white",
              borderRadius: "3px",
              padding: "5px 10px",
            }}
            onClick={makeProductApproval}
          >
            Approve
          </button>
        )}
        {product?.approval_status === "Approved" && (
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

        {/* uncammand later */}
        {/* {product.approval_status === "Approved" && (
          <div className="ms-3">
            <lable
              style={{ color: "#333", fontSize: "14px", fontWeight: "600" }}
            >
              <span
                style={{
                  color: product.isActive ? "#35d482" : "red",
                  // fontSize: "20px",
                }}
              >
                {product.isActive ? "Active" : "In Active"}{" "}
              </span>{" "}
            </lable>
            <span>
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
            </span>
          </div>
        )} */}
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
          <Modal.Title>Disapprove Product</Modal.Title>
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
              onClick={makeProductDisapproval}
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

export default ProductDetails;
