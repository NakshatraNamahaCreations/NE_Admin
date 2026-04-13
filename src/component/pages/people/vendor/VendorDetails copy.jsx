import React from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../api-services/apiContents";

function VendorDetails() {
  const location = useLocation();
  const vendor = location.state.vendor;
  console.log("vendor details in cendor det>>", vendor);

  return (
    <div className="ps-3 pt-2 ">
      <div className="pb-3" style={{ display: "flex", fontSize: "14px" }}>
        <a
          href="/vendor-list"
          className="pe-1"
          style={{ color: "#7d8592", textDecoration: "none" }}
        >
          Vendor
        </a>{" "}
        <div className="pe-1">/</div> <div className="pe-1">Vendor Details</div>{" "}
      </div>

      <div className="vendor-profile-background-imge"></div>
      <div className="row">
        <div
          className="col-md-8"
          style={{ position: "absolute", top: "110px" }}
        >
          <div className="d-flex p-3 mx-2">
            <img
              src={`${apiUrl.IMAGEURL}${vendor.shop_image_or_logo}`}
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
            <div className="mx-3 pt-3">
              <h4 style={{ fontSize: "20px", color: "#609ecc" }}>
                {vendor.vendor_name}{" "}
              </h4>
              <h6 style={{ fontSize: "14px" }}>{vendor.profession}</h6>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{ position: "relative", top: "-150px", left: "40px" }}>
        <div>
          <img
            src={`${apiUrl.IMAGEURL}${vendor.shop_image_or_logo}`}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <div>
              <h4 style={{ fontSize: "2.125rem", color: "#609ecc" }}>
                {vendor.vendor_name}{" "}
              </h4>
              <h6 style={{ fontSize: "15px" }}>
                +91-{vendor.mobile_number} | {vendor.email}
              </h6>
            </div>
            <div>
              <h6 style={{ fontSize: "15px" }}>{vendor.mobile_number} </h6>
              <h6 style={{ fontSize: "15px" }}>{vendor.email} </h6>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default VendorDetails;
