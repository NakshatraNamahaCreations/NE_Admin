import React, { useEffect, useState } from "react";
import "../../../../styles/teammember.css";
import { Button } from "react-bootstrap";
import { postData } from "../../../../api-services/apiHelper";
import { apiUrl } from "../../../../api-services/apiContents";
// import axios from "axios";
// import {
//   PiFlagBannerDuotone,
//   PiGlobeDuotone,
//   PiUserCircleDuotone,
//   PiBookOpenDuotone,
//   PiBookDuotone,
//   PiChatTeardropDotsDuotone,
//   PiSpeakerSimpleHighDuotone,
//   PiPathDuotone,
//   PiUsersThreeDuotone,
// } from "react-icons/pi";
// import { CiDiscount1 } from "react-icons/ci";
// import { postData } from "../../../Api-Service/apiHelper";
// import { apiUrl } from "../../../Api-Service/apiConstants";

function CreateTeam() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [dashboard, setDashboard] = useState(false);

  // const [userBooking, setUserBooking] = useState(false);
  // const [vendorOrders, setVendorOrders] = useState(false);
  // const [manageSellProducts, setManageSellProducts] = useState(false);

  const [banner, setBanner] = useState(false);
  const [service, setService] = useState(false);
  const [subService, setSubService] = useState(false);
  const [requirements, setRequirements] = useState(false);
  const [profile, setProfile] = useState(false);
  const [manageUser, setManageUser] = useState(false);
  const [manageVendor, setManageVendor] = useState(false);
  const [manageTeams, setManageTeams] = useState(false);
  const [states, setStates] = useState(false);
  const [cities, setCities] = useState(false);
  const [billingAddress, setBillingAddress] = useState(false);
  const [manageRentalProducts, setManageRentalProducts] = useState(false);
  const [calculator, setCalculator] = useState(false);
  const [eventReport, setEventReport] = useState(false);
  const [vendorInvoice, setVendorInvoice] = useState(false);
  const [serviceList, setServiceList] = useState(false);
  const [cancelEvent, setCancelEvent] = useState(false);
  const [rescheduleEvent, setRescheduleEvent] = useState(false);
  const [ticketRaised, setTicketRaised] = useState(false);
  const [payoutConfig, setPayoutConfig] = useState(false);
  const [productPayout, setProductPayout] = useState(false);
  const [servicePayout, setServicePayout] = useState(false);
  const [techPayout, setTechPayout] = useState(false);
  const [faq, setFAQ] = useState(false);
  const [tnc, settnc] = useState(false);
  const [youtube, setYoutube] = useState(false);
  const [randomString, setRandomString] = useState("");
  // const [listItems, setListItems] = useState();

  useEffect(() => {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const string_length = 10;
    let result = "";
    for (let i = 0; i < string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      result += chars.substring(rnum, rnum + 1);
    }
    setRandomString(result);
  }, []);

  // console.log("randomstring", randomstring);

  const sidebarList = [
    {
      id: 1,
      name: "Team",
    },
    {
      id: 2,
      name: "Banners",
    },
    {
      id: 3,
      name: "Service",
    },
    {
      id: 4,
      name: "Sub Services",
    },
    {
      id: 5,
      name: "Requirements",
    },
    {
      id: 6,
      name: "States",
    },
    {
      id: 7,
      name: "Cities",
    },
    {
      id: 8,
      name: "Billing Address",
    },
    {
      id: 9,
      name: "Manage User",
    },
    {
      id: 10,
      name: "Manage Vendor",
    },
    {
      id: 12,
      name: "Manage Rental Products",
    },
    {
      id: 13,
      name: "Events Report",
    },
    {
      id: 14,
      name: "Calculator",
    },
    {
      id: 15,
      name: "Cancel Events",
    },
    {
      id: 16,
      name: "Rescheduled Events",
    },
    {
      id: 17,
      name: "Tickets Raised",
    },
    {
      id: 18,
      name: "Payout Config",
    },
    {
      id: 19,
      name: "Product Payout's",
    },
    {
      id: 20,
      name: "Service Payout's",
    },
    {
      id: 21,
      name: "Technician Payout's",
    },
    {
      id: 22,
      name: "FAQ",
    },
    {
      id: 23,
      name: "T&C",
    },
    {
      id: 24,
      name: "Youtube Videos",
    },
  ];

  // const manageList = (newItem) => {
  //   setListItems([...listItems, newItem]);
  // };
  // console.log("listItems", listItems.name);

  const selectAll = () => {
    setProfile(!profile);
    setBanner(!banner);
    setService(!service);
    setSubService(!subService);
    // setRequirements(!requirements);
    setStates(!states);
    setCities(!cities);
    setBillingAddress(!billingAddress);
    setManageUser(!manageUser);
    setManageVendor(!manageVendor);
    setManageTeams(!manageTeams);
    setManageRentalProducts(!manageRentalProducts);
    setEventReport(!eventReport);
    setVendorInvoice(!vendorInvoice);
    setServiceList(!serviceList);
    setCalculator(!calculator);
    setCancelEvent(!cancelEvent);
    setRescheduleEvent(!rescheduleEvent);
    setTicketRaised(!ticketRaised);
    setPayoutConfig(!payoutConfig);
    setProductPayout(!productPayout);
    setServicePayout(!servicePayout);
    setTechPayout(!techPayout);
    setFAQ(!faq);
    settnc(!tnc);
    setYoutube(!youtube);
  };

  const addTeamMember = async () => {
    if (!name || !phoneNumber) {
      alert("Name and Phone number should not empty");
    } else {
      try {
        const data = {
          member_name: name,
          mobile_number: phoneNumber,
          email_id: emailId,
          password: randomString,
          profile: profile,
          // dashboard_management: dashboard,
          banner_management: banner,
          service_management: service,
          subservice_management: subService,
          billing_address: billingAddress,
          state: states,
          city: cities,
          // requirement_management: requirements,
          // userbooking_management: userBooking,
          // vendororder_management: vendorOrders,
          manage_user: manageUser,
          manage_vendor: manageVendor,
          manage_teammemebrs: manageTeams,
          // manage_sellproducts: manageSellProducts,
          manage_rentalproducts: manageRentalProducts,
          event_report: eventReport,
          vendor_invoice: vendorInvoice,
          service_list: serviceList,
          calculate: calculator,
          cancel_event: cancelEvent,
          reschedule_event: rescheduleEvent,
          ticket_raised: ticketRaised,
          pyout_config: payoutConfig,
          product_payout: productPayout,
          service_payout: servicePayout,
          tech_payout: techPayout,
          faq: faq,
          tnc: tnc,
          youtube_video: youtube,
        };
        const res = await postData(apiUrl.CREATE_TEAM, data);
        // const res = await axios.post(
        //   // `http://localhost:9000/api${apiUrl.CREATE_TEAM}`,
        //   data
        // );
        if (res) {
          alert(res.message || "Added");
          console.log("res", res);
          window.location.assign("/team/team-list");
        }
      } catch (error) {
        console.log("Error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="root-0-1-732 contentContainer-0-1-726 mt-2">
      <div className="leftSection-0-1-728 row">
        <div className="label-0-1-733 col-md-3">
          <div className="labelText-0-1-734">Name</div>
          <div className="inputContainer-0-1-133 undefined ">
            <input
              className="input-0-1-134 input-d21-0-1-1124 undefined"
              placeholder="Enter Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="label-0-1-733 col-md-3">
          <div className="labelText-0-1-734">Phone number </div>
          <div className="inputContainer-0-1-133 undefined ">
            <input
              className="input-0-1-134 input-d22-0-1-1125 undefined"
              placeholder="Enter Phone Number"
              type="tel"
              maxLength={10}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="label-0-1-733 col-md-3">
          <div className="labelText-0-1-734">Email Id</div>
          <div className="inputContainer-0-1-133 undefined ">
            <input
              className="input-0-1-134 input-d23-0-1-1126 undefined"
              placeholder="Email"
              type="email"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>
        </div>
        <div className="label-0-1-733 col-md-3">
          <div className="labelText-0-1-734">Password</div>
          <div className="inputContainer-0-1-133 undefined ">
            <input
              className="input-0-1-134 input-d23-0-1-1126 undefined"
              placeholder="Password"
              type="text"
              value={randomString}
              disabled
              // onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <div className="labelText-0-1-734">Permissions</div>
        <div
          className="labelText-0-1-734"
          onClick={selectAll}
          style={{ cursor: "pointer" }}
        >
          Select All
        </div>
      </div>
      <div className="label-0-1-733 mt-2 row">
        {/* <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
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
        </div> */}
        {/* {sidebarList.map((item) => (
          <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
            <div className="textSubText-0-1-183">
              <div className="toggleHeading-0-1-178 undefined">
                <div className="permissionIconTextWrap-0-1-172">
                  <div className="textWrapper-0-1-176">
                    <span>
                      <div>{item.name}</div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="medium-0-1-180">
              <div className="ui fitted toggle checkbox undefined ">
                <input
                  type="checkbox"
                  onChange={() => manageList(item)}
                  checked={item.checked}
                />
              </div>
            </div>
          </div>
        ))} */}
        <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
          <div className="textSubText-0-1-183">
            <div className="toggleHeading-0-1-178 undefined">
              <div className="permissionIconTextWrap-0-1-172">
                <div className="textWrapper-0-1-176">
                  <span>
                    <div>Company Profile</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={profile}
                onChange={() => setProfile(!profile)}
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
                    <div>Banner's</div>
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
                    <div>Service</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={service}
                onChange={() => setService(!service)}
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
                    <div>Sub Service</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={subService}
                onChange={() => setSubService(!subService)}
              />
            </div>
          </div>
        </div>
        {/* <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
          <div className="textSubText-0-1-183">
            <div className="toggleHeading-0-1-178 undefined">
              <div className="permissionIconTextWrap-0-1-172">
                <div className="textWrapper-0-1-176">
                  <span>
                    <div>Requirements</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={requirements}
                onChange={() => setRequirements(!requirements)}
              />
            </div>
          </div>
        </div> */}

        <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
          <div className="textSubText-0-1-183">
            <div className="toggleHeading-0-1-178 undefined">
              <div className="permissionIconTextWrap-0-1-172">
                <div className="textWrapper-0-1-176">
                  <span>
                    <div>States</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined">
              <input
                type="checkbox"
                checked={states}
                onChange={() => setStates(!states)}
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
                    <div>Cities</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={cities}
                onChange={() => setCities(!cities)}
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
                    <div>Billing Address</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={billingAddress}
                onChange={() => setBillingAddress(!billingAddress)}
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
                    <div>Manage User's</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={manageUser}
                onChange={() => setManageUser(!manageUser)}
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
                    <div>Manage Vendor's</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={manageVendor}
                onChange={() => setManageVendor(!manageVendor)}
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
                checked={manageTeams}
                onChange={() => setManageTeams(!manageTeams)}
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
                    <div>Rental Products</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={manageRentalProducts}
                onChange={() => setManageRentalProducts(!manageRentalProducts)}
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
                    <div>Rental Service</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={serviceList}
                onChange={() => setServiceList(!serviceList)}
              />
            </div>
          </div>
        </div>
        {/* <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
          <div className="textSubText-0-1-183">
            <div className="toggleHeading-0-1-178 undefined">
              <div className="permissionIconTextWrap-0-1-172">
                <div className="textWrapper-0-1-176">
                  <span>
                    <div>Management Sell Products</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={manageSellProducts}
                onChange={() => setManageSellProducts(!manageSellProducts)}
              />
            </div>
          </div>
        </div> */}
        <div className="toggleContainer-0-1-177 toggleBar-0-1-171 col-md-3">
          <div className="textSubText-0-1-183">
            <div className="toggleHeading-0-1-178 undefined">
              <div className="permissionIconTextWrap-0-1-172">
                <div className="textWrapper-0-1-176">
                  <span>
                    <div>Event Report</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={eventReport}
                onChange={() => setEventReport(!eventReport)}
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
                    <div>Vendor Invoice</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={vendorInvoice}
                onChange={() => setVendorInvoice(!vendorInvoice)}
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
                    <div>Calculator</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={calculator}
                onChange={() => setCalculator(!calculator)}
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
                    <div>Cancel Events</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={cancelEvent}
                onChange={() => setCancelEvent(!cancelEvent)}
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
                    <div>Rescheduled Events</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={rescheduleEvent}
                onChange={() => setRescheduleEvent(!rescheduleEvent)}
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
                    <div>Tickets Raised</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={ticketRaised}
                onChange={() => setTicketRaised(!ticketRaised)}
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
                    <div>Payout Config</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={payoutConfig}
                onChange={() => setPayoutConfig(!payoutConfig)}
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
                    <div>Product Payout's</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={productPayout}
                onChange={() => setProductPayout(!productPayout)}
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
                    <div>Service Payout's</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={servicePayout}
                onChange={() => setServicePayout(!servicePayout)}
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
                    <div>Technician Payout's</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={techPayout}
                onChange={() => setTechPayout(!techPayout)}
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
                    <div>FAQ</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={faq}
                onChange={() => setFAQ(!faq)}
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
                    <div>T&C</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={tnc}
                onChange={() => settnc(!tnc)}
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
                    <div>Youtube Videos</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="medium-0-1-180">
            <div className="ui fitted toggle checkbox undefined ">
              <input
                type="checkbox"
                checked={youtube}
                onChange={() => setYoutube(!youtube)}
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
        <Button className="ms-2 px-5" variant="info" onClick={addTeamMember}>
          Save & Proceed &nbsp; <i className="fa-solid fa-arrow-right-long"></i>
        </Button>
      </div>
    </div>
  );
}

export default CreateTeam;
