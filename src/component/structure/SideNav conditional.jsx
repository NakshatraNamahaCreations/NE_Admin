import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
// import { FaBarsStaggered, FaBookOpen } from "react-icons";
import { RiDashboardFill } from "react-icons/ri";
// import { FaUser } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { MdMiscellaneousServices } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

function SideNav() {
  const storedUser = sessionStorage.getItem("user");
  const user = JSON.parse(storedUser);
  console.log("storedUser", user);

  const location = useLocation();
  const { pathname } = location;
  const getColor = (path) => {
    return pathname === path ? "#609ecc" : "";
  };
  const getBorderLeft = (path) => {
    return pathname === path ? "2px solid #609ecc" : "";
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sessionStorage.removeItem("user");
      window.location.assign("/");
    } else {
      console.log("Logout canceled");
    }
  };

  return (
    <div>
      <Sidebar>
        <Menu>
          <div style={{ padding: "14px 0px", textAlign: "center" }}>
            <a
              href="/dashboard"
              style={{
                color: "black",
                textDecoration: "none",
                textShadow: "-1px 1px #ddd6cd",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <LuBoxes
                size={25}
                color="#609ecc"
                style={{ marginTop: "-7px" }}
              />{" "}
              NITHYA EVENTS
            </a>
          </div>

          {/* Dashboard */}
          {/* {user.dashboard_management && ( */}
          <MenuItem
            className="sidebar-font-menu"
            component={<Link to="/dashboard" />}
            icon={<RiDashboardFill className="sidebar-icons" />}
            style={{
              borderLeft: getBorderLeft("/dashboard"),
              color: getColor("/dashboard"),
            }}
          >
            Dashboard
          </MenuItem>
          {/* )} */}

          {/* Banners */}
          {user.banner_management && (
            <MenuItem
              className="sidebar-font-menu"
              component={<Link to="/spotlight-banner" />}
              icon={<FaImage className="sidebar-icons" />}
              style={{
                borderLeft: getBorderLeft("/spotlight-banner"),
                color: getColor("/spotlight-banner"),
              }}
            >
              Banners
            </MenuItem>
          )}

          {/* Service Management */}
          {(user.service_management ||
            user.subservice_management ||
            user.requirement_management) && (
            <SubMenu
              className="sidebar-font-menu"
              label="Service Management"
              icon={<MdMiscellaneousServices className="sidebar-icons" />}
            >
              {user.service_management && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/service/addservice" />}
                  style={{
                    borderLeft: getBorderLeft("/service/addservice"),
                    color: getColor("/service/addservice"),
                  }}
                >
                  Service
                </MenuItem>
              )}
              {user.subservice_management && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/service/subservice" />}
                  style={{
                    borderLeft: getBorderLeft("/service/subservice"),
                    color: getColor("/service/subservice"),
                  }}
                >
                  Sub Services
                </MenuItem>
              )}
              {user.requirement_management && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/service/requirements" />}
                  style={{
                    borderLeft: getBorderLeft("/service/requirements"),
                    color: getColor("/service/requirements"),
                  }}
                >
                  Requirements
                </MenuItem>
              )}
            </SubMenu>
          )}

          {/* Order Management */}
          {(user.userbooking_management || user.vendororder_management) && (
            <SubMenu
              className="sidebar-font-menu"
              label="Order Management"
              icon={<FaRegCalendarCheck className="sidebar-icons" />}
            >
              {user.userbooking_management && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/booking/user-bookings" />}
                  style={{
                    borderLeft: getBorderLeft("/booking/user-bookings"),
                    color: getColor("/booking/user-bookings"),
                  }}
                >
                  User Bookings
                </MenuItem>
              )}
              {user.vendororder_management && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/order/vendor-orders" />}
                  style={{
                    borderLeft: getBorderLeft("/order/vendor-orders"),
                    color: getColor("/order/vendor-orders"),
                  }}
                >
                  Vendor Orders
                </MenuItem>
              )}
            </SubMenu>
          )}

          {/* People Management */}
          {(user.manage_user ||
            user.manage_vendor ||
            user.manage_teammemebrs) && (
            <SubMenu
              className="sidebar-font-menu"
              label="People"
              icon={<BsFillPeopleFill className="sidebar-icons" />}
            >
              {user.manage_user && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/user-list" />}
                  style={{
                    borderLeft: getBorderLeft("/user-list"),
                    color: getColor("/user-list"),
                  }}
                >
                  User
                </MenuItem>
              )}
              {user.manage_vendor && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/vendor-list" />}
                  style={{
                    borderLeft: getBorderLeft("/vendor-list"),
                    color: getColor("/vendor-list"),
                  }}
                >
                  Vendor
                </MenuItem>
              )}
              {user.manage_teammemebrs && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/team/team-list" />}
                  style={{
                    borderLeft: getBorderLeft("/team/team-list"),
                    color: getColor("/team/team-list"),
                  }}
                >
                  Team
                </MenuItem>
              )}
            </SubMenu>
          )}

          {/* Product Listings */}
          {(user.manage_rentalproducts || user.manage_sellproducts) && (
            <SubMenu
              className="sidebar-font-menu"
              label="Product Listings"
              icon={<BsFillPeopleFill className="sidebar-icons" />}
            >
              {user.manage_rentalproducts && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/product/rentals" />}
                  style={{
                    borderLeft: getBorderLeft("/product/rentals"),
                    color: getColor("/product/rentals"),
                  }}
                >
                  Rental
                </MenuItem>
              )}
              {user.manage_sellproducts && (
                <MenuItem
                  className="sidebar-font-submenu"
                  component={<Link to="/product/selling" />}
                  style={{
                    borderLeft: getBorderLeft("/product/selling"),
                    color: getColor("/product/selling"),
                  }}
                >
                  Sell
                </MenuItem>
              )}
            </SubMenu>
          )}

          {/* Logout */}
          <MenuItem
            className="sidebar-font-menu"
            icon={<RiLogoutCircleLine className="sidebar-icons" />}
            onClick={logout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SideNav;
