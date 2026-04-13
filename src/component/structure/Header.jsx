import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import GlobalContext from "../../hooks/GlobalProvider";

function Header() {
  const { globalData } = useContext(GlobalContext);
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  // const storedUser = sessionStorage.getItem("user");
  // const user = JSON.parse(storedUser);

  switch (pathname) {
    // case "/dashboard":
    //   return (
    //     <div>
    //       <div className="headerTitle-0-1-70">
    //         Hi, Admin
    //         {/* {user.member_name} */}
    //       </div>
    //       <div className="headerDesc-0-1-71">
    //         <div>Welcome Back!</div>
    //       </div>
    //     </div>
    //   );
    case "/company-profile":
      return (
        <div>
          <div className="headerTitle-0-1-70">Company Profile</div>
        </div>
      );
    case "/technicians/technicians-list":
      return (
        <div>
          <div className="headerTitle-0-1-70">Technicians</div>
        </div>
      );
    case "/service/addservice":
      return (
        <div>
          <div className="headerTitle-0-1-70">Services</div>
        </div>
      );
    case "/service/subservice":
      return (
        <div>
          <div className="headerTitle-0-1-70">Sub Service</div>
        </div>
      );
    case "/service/requirements":
      return (
        <div>
          <div className="headerTitle-0-1-70">Requirements</div>
        </div>
      );
    case "/state":
      return (
        <div>
          <div className="headerTitle-0-1-70">States</div>
        </div>
      );
    case "/city":
      return (
        <div>
          <div className="headerTitle-0-1-70">Cities</div>
        </div>
      );
    case "/address":
      return (
        <div>
          <div className="headerTitle-0-1-70">Address</div>
        </div>
      );
    case "/booking/user-bookings":
      return (
        <div>
          <div className="headerTitle-0-1-70">Booking History</div>
        </div>
      );
    case "/booking/booking-history":
      return (
        <div>
          <div className="headerTitle-0-1-70">Payment History</div>
        </div>
      );
    case "/booking/booking-details":
      return (
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
          <div className="headerTitle-0-1-70">Payment Details</div>
          {/* <div className="headerDesc-0-1-71">
            <a
              href="/booking/booking-history"
              style={{
                color: "#444",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <IoIosArrowBack /> Back
            </a>
          </div> */}
        </div>
      );

    case "/booking/invoice":
      return (
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
          <div className="headerTitle-0-1-70">Invoice</div>
          <div className="headerDesc-0-1-71">
            <div
              // href="/booking/booking-details"
              style={{
                color: "#444",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack />
              Back
            </div>
          </div>
        </div>
      );
    case "/vendor-list":
      return (
        <div>
          <div className="headerTitle-0-1-70">
            Vendor List{" "}
            {globalData?.vendorsLength === 0 ? null : (
              <>({globalData?.vendorsLength})</>
            )}
          </div>
        </div>
      );
    case "/user-list":
      return (
        <div>{/* <div className="headerTitle-0-1-70">User List</div> */}</div>
      );
    case "/spotlight-banner":
      return (
        <div>
          <div className="headerTitle-0-1-70">Banners</div>
          {/* <div className="headerDesc-0-1-71">
              <div>Add / view content of your course</div>
            </div> */}
        </div>
      );
    case "/vendor/vendor-products":
      return (
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
          <div className="headerTitle-0-1-70">Products</div>
          <div className="headerDesc-0-1-71">
            <a
              href="/vendor-list"
              style={{
                color: "#444",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <IoIosArrowBack /> Back
            </a>
          </div>
        </div>
      );
    case "/product/selling":
      return (
        <div
          className="d-flex mb-3"
          style={{ justifyContent: "space-between" }}
        >
          <div className="headerTitle-0-1-70">Selling Products</div>
        </div>
      );
    case "/product/rentals":
      return (
        <div
          className="d-flex mb-3"
          style={{ justifyContent: "space-between" }}
        >
          <div className="headerTitle-0-1-70">Rentals Products</div>
        </div>
      );
    case "/product/service-list":
      return (
        <div
          className="d-flex mb-3"
          style={{ justifyContent: "space-between" }}
        >
          <div className="headerTitle-0-1-70">Service List</div>
        </div>
      );
    case "/order/vendor-orders":
      return (
        <div>
          <div className="headerTitle-0-1-70">Vendor Order's</div>
        </div>
      );
    case "/team/team-list":
      return (
        <div>
          <div className="headerTitle-0-1-70">Manage Teams </div>
          <div className="headerDesc-0-1-71">
            <div className="mt-2">
              <button
                style={{
                  backgroundColor: "#609ecc",
                  border: "#7ac536",
                  color: "white",
                  borderRadius: "3px",
                  fontSize: "15px",
                  padding: "5px 10px",
                }}
                onClick={() => window.location.assign("/team/create-team")}
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      );
    case "/team/create-team":
      return (
        <div>
          <div className="headerTitle-0-1-70">Create Teams</div>
        </div>
      );
    case "/team/edit-user":
      return (
        <div>
          <div className="headerTitle-0-1-70">Edit Team</div>
        </div>
      );
    case "/faq-list":
      return (
        <div>
          <div className="headerTitle-0-1-70">FAQs</div>
          <div className="headerDesc-0-1-71">
            <div className="mt-2">
              <button
                style={{
                  backgroundColor: "#609ecc",
                  border: "#7ac536",
                  color: "white",
                  borderRadius: "3px",
                  fontSize: "15px",
                  padding: "5px 10px",
                }}
                onClick={() => window.location.assign("/add-faq")}
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      );
    case "/add-faq":
      return (
        <div>
          <div className="headerTitle-0-1-70">FAQs</div>
        </div>
      );
    case "/terms-and-condition-list":
      return (
        <div>
          <div className="headerTitle-0-1-70">Terms & Conditions</div>
        </div>
      );

    case "/youtube-video":
      return (
        <div>
          <div className="headerTitle-0-1-70">Youtube Videos</div>
        </div>
      );
    case "/booking/user-cancel-events":
      return (
        <div>
          <div className="headerTitle-0-1-70">Cancel Events</div>
        </div>
      );
    case "/booking/user-rescheduled-events":
      return (
        <div>
          <div className="headerTitle-0-1-70">Rescheduled Events</div>
        </div>
      );
    case "/payout-config":
      return (
        <div>
          <div className="headerTitle-0-1-70">Payout Config</div>
        </div>
      );
    default:
      return "";
  }
}

export default Header;
