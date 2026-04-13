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
  const [emailId, setEmailId] = useState("");
  const [profile, setProfile] = useState(false);
  const [banner, setBanner] = useState(false);
  const [service, setService] = useState(false);
  const [subService, setSubService] = useState(false);
  const [requirements, setRequirements] = useState(false);
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
  //   console.log("user>>>", user);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_TEAM}/${user}`,
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
      setEmailId(member.email_id || "");
      setBanner(member.banner_management || false);
      setProfile(member.profile || false);
      setService(member.service_management || false);
      setSubService(member.subservice_management || false);
      setRequirements(member.requirement_management || false);
      setStates(member.state || false);
      setCities(member.city || false);
      setBillingAddress(member.billing_address || false);
      setManageUser(member.manage_user || false);
      setManageVendor(member.manage_vendor || false);
      setManageTeams(member.manage_teammemebrs || false);
      setManageRentalProducts(member.manage_rentalproducts || false);
      setEventReport(member.event_report || false);
      setVendorInvoice(member.vendor_invoice || false);
      setServiceList(member.service_list || false);
      setCalculator(member.calculate || false);
      setCancelEvent(member.cancel_event || false);
      setRescheduleEvent(member.reschedule_event || false);
      setTicketRaised(member.ticket_raised || false);
      setPayoutConfig(member.pyout_config || false);
      setProductPayout(member.product_payout || false);
      setServicePayout(member.service_payout || false);
      setTechPayout(member.tech_payout || false);
      setFAQ(member.faq || false);
      settnc(member.tnc || false);
      setYoutube(member.youtube_video || false);
    }
  }, [member]);

  const editUser = async () => {
    try {
      const data = {
        member_name: name,
        mobile_number: phoneNumber,
        email_id: emailId,
        password: password,
        profile: profile,
        banner_management: banner,
        service_management: service,
        subservice_management: subService,
        billing_address: billingAddress,
        state: states,
        city: cities,
        requirement_management: requirements,
        manage_user: manageUser,
        manage_vendor: manageVendor,
        manage_teammemebrs: manageTeams,
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
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_USER}${member._id}`,
        data,
      );
      if (res.status === 200) {
        alert(res.data.message || "Updated!");
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
        <div className="root-0-1-732 contentContainer-0-1-726">
          <div className="leftSection-0-1-728 row">
            <div className="label-0-1-733 col-md-3">
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
            <div className="label-0-1-733 col-md-3">
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
            <div className="label-0-1-733 col-md-3">
              <div className="labelText-0-1-734">Email Id</div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d23-0-1-1126 undefined"
                  placeholder="Email"
                  type="email"
                  value={emailId}
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
                    onChange={() =>
                      setManageRentalProducts(!manageRentalProducts)
                    }
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
