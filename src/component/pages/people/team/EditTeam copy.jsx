import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import "../../../../styles/teammember.css";
import { Button } from "react-bootstrap";
import { postData } from "../../../../api-services/apiHelper";
import Loader from "../../../loader/Loader";

function EditTeam() {
  const location = useLocation();
  const user = location.state.userId;
  const [member, setMemeber] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState(false);
  const [banner, setBanner] = useState(false);
  const [service, setService] = useState(false);
  const [subService, setSubService] = useState(false);
  const [requirements, setRequirements] = useState(false);
  const [userBooking, setUserBooking] = useState(false);
  const [vendorOrders, setVendorOrders] = useState(false);
  const [manageUser, setManageUser] = useState(false);
  const [manageVendor, setManageVendor] = useState(false);
  const [manageTeams, setManageTeams] = useState(false);
  const [manageSellProducts, setManageSellProducts] = useState(false);
  const [manageRentalProducts, setManageRentalProducts] = useState(false);

  //   console.log("user>>>", user);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_USER}/${user}`
        );
        if (res.status === 200) {
          //   console.log(res);
          setMemeber(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);
  console.log("member", member);

  useEffect(() => {
    if (member) {
      setName(member.member_name || "");
      setPhoneNumber(member.mobile_number || "");
      setPassword(member.password || "");
      setDashboard(member.dashboard_management || false);
      setBanner(member.banner_management || false);
      setService(member.service_management || false);
      setSubService(member.subservice_management || false);
      setRequirements(member.requirement_management || false);
      setUserBooking(member.userbooking_management || false);
      setVendorOrders(member.vendororder_management || false);
      setManageUser(member.manage_user || false);
      setManageVendor(member.manage_vendor || false);
      setManageTeams(member.manage_teammemebrs || false);
      setManageSellProducts(member.manage_sellproducts || false);
      setManageRentalProducts(member.manage_rentalproducts || false);
    }
  }, [member]);

  const editUser = async () => {
    try {
      const data = {
        member_name: name,
        mobile_number: phoneNumber,
        password: password,
        dashboard: dashboard,
        // banner: banner,
        booking_management: bookingManagement,
        vendor_management: vendorManagement,
        team_management: teamManagement,
        user_management: userManagement,
      };
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_USER}/${member._id}`,
        data
      );
      if (res.status === 200) {
        alert(res.data.message);
        console.log("res", res);
        window.location.assign("/team/team-list");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <br />
      {!isLoading && (
        <div className="root-0-1-732 contentContainer-0-1-726 mt-2">
          <div className="leftSection-0-1-728 row">
            <div className="label-0-1-733 col-md-4">
              <div className="labelText-0-1-734">Name</div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d21-0-1-1124 undefined"
                  placeholder="Enter Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="label-0-1-733 col-md-4">
              <div className="labelText-0-1-734">Phone number </div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d22-0-1-1125 undefined"
                  placeholder="Enter Phone Number"
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="label-0-1-733 col-md-4">
              <div className="labelText-0-1-734">Password</div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d23-0-1-1126 undefined"
                  placeholder="Password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="labelText-0-1-734">Permissions</div>
          <div className="label-0-1-733 mt-2 row">
            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>Dashboard</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined">
                  <input
                    type="checkbox"
                    checked={dashboard}
                    onChange={() => setDashboard(!dashboard)}
                  />
                </div>
              </div>
            </div>

            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>Banner</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined ">
                  <input
                    type="checkbox"
                    checked={banner}
                    onChange={() => setBanner(!banner)}
                  />
                </div>
              </div>
            </div>
            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>Booking Management</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined ">
                  <input
                    type="checkbox"
                    checked={bookingManagement}
                    onChange={() => setBookingManagement(!bookingManagement)}
                  />
                </div>
              </div>
            </div>
            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>User Management</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined ">
                  <input
                    type="checkbox"
                    checked={userManagement}
                    onChange={() => setUserManagement(!userManagement)}
                  />
                </div>
              </div>
            </div>
            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>Vendor Management</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined ">
                  <input
                    type="checkbox"
                    checked={vendorManagement}
                    onChange={() => setVendorManagement(!vendorManagement)}
                  />
                </div>
              </div>
            </div>
            <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
              <div className="textSubText-0-1-183">
                <div className="toggleHeading-0-1-178 undefined">
                  <div className="permissionIconTextWrap-0-1-172">
                    <div className="textWrapper-0-1-176">
                      <span>
                        <div>Team Management</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="medium-0-1-180">
                <div className="ui fitted toggle checkbox undefined ">
                  <input
                    type="checkbox"
                    checked={teamManagement}
                    onChange={() => setTeamManagement(!teamManagement)}
                  />
                </div>
              </div>
            </div>
          </div>

          <br />
          <div className="footerNavContainer-0-1-444 footerNavContainer-d0-0-1-457">
            <Button
              className="px-5 py-2"
              variant="outline-info"
              onClick={() => window.location.assign("/team/team-list")}
            >
              <i className="fa-solid fa-arrow-left-long"></i> &nbsp; Back
            </Button>{" "}
            <Button className="ms-2 px-5" variant="info" onClick={editUser}>
              Update &nbsp; <i className="fa-solid fa-arrow-right-long"></i>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default EditTeam;
