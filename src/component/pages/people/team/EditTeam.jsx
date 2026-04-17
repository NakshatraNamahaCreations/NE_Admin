import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import "../../../../styles/teammember.css";
import { Button, Spinner, Toast, ToastContainer } from "react-bootstrap";
import Loader from "../../../loader/Loader";

const NAME_REGEX = /^[A-Za-z][A-Za-z.\s'-]{1,49}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const validateName = (v) => {
  const val = (v || "").trim();
  if (!val) return "Name is required";
  if (val.length < 2) return "Name must be at least 2 characters";
  if (!NAME_REGEX.test(val))
    return "Only letters, spaces, dots, hyphens and apostrophes allowed";
  return "";
};
const validatePhone = (v) => {
  const val = (v || "").trim();
  if (!val) return "Phone number is required";
  if (!/^\d+$/.test(val)) return "Phone number must contain only digits";
  if (val.length !== 10) return "Phone number must be exactly 10 digits";
  if (!PHONE_REGEX.test(val))
    return "Enter a valid mobile number (starts with 6-9)";
  return "";
};
const validateEmail = (v) => {
  const val = (v || "").trim();
  if (!val) return "Email is required";
  if (!EMAIL_REGEX.test(val)) return "Enter a valid email address";
  return "";
};

const errorTextStyle = {
  color: "#dc3545",
  fontSize: 12,
  marginTop: 4,
  minHeight: 16,
  display: "block",
};
const invalidBorder = { borderColor: "#dc3545" };

function EditTeam() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.userId;
  const [member, setMemeber] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [emailId, setEmailId] = useState("");
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [profile, setProfile] = useState(false);
  const [banner, setBanner] = useState(false);
  const [service, setService] = useState(false);
  const [subService, setSubService] = useState(false);
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

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
  }, []);

  useEffect(() => {
    if (!user) {
      showToast("Invalid team member reference", "danger");
      setIsLoading(false);
      return;
    }
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_TEAM}/${user}`,
        );
        if (res.status === 200) {
          setMemeber(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch team member:", error);
        showToast(
          error?.response?.data?.message ||
            "Unable to load team member details",
          "danger",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user, showToast]);

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

  const handleNameChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/^\s+/, "");
      setName(value);
      if (touched.name) setErrors((p) => ({ ...p, name: validateName(value) }));
    },
    [touched.name],
  );

  const handlePhoneChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setPhoneNumber(value);
      if (touched.phone)
        setErrors((p) => ({ ...p, phone: validatePhone(value) }));
    },
    [touched.phone],
  );

  const handleEmailChange = useCallback(
    (e) => {
      const value = e.target.value.trim();
      setEmailId(value);
      if (touched.email)
        setErrors((p) => ({ ...p, email: validateEmail(value) }));
    },
    [touched.email],
  );

  const handleBlur = useCallback(
    (field) => {
      setTouched((p) => ({ ...p, [field]: true }));
      if (field === "name")
        setErrors((p) => ({ ...p, name: validateName(name) }));
      if (field === "phone")
        setErrors((p) => ({ ...p, phone: validatePhone(phoneNumber) }));
      if (field === "email")
        setErrors((p) => ({ ...p, email: validateEmail(emailId) }));
    },
    [name, phoneNumber, emailId],
  );

  const validateAll = useCallback(() => {
    const next = {
      name: validateName(name),
      phone: validatePhone(phoneNumber),
      email: validateEmail(emailId),
    };
    setErrors(next);
    setTouched({ name: true, phone: true, email: true });
    return !next.name && !next.phone && !next.email;
  }, [name, phoneNumber, emailId]);

  const hasAnyPermission = useMemo(
    () =>
      profile ||
      banner ||
      service ||
      subService ||
      states ||
      cities ||
      billingAddress ||
      manageUser ||
      manageVendor ||
      manageTeams ||
      manageRentalProducts ||
      eventReport ||
      vendorInvoice ||
      serviceList ||
      calculator ||
      cancelEvent ||
      rescheduleEvent ||
      ticketRaised ||
      payoutConfig ||
      productPayout ||
      servicePayout ||
      techPayout ||
      faq ||
      tnc ||
      youtube,
    [
      profile,
      banner,
      service,
      subService,
      states,
      cities,
      billingAddress,
      manageUser,
      manageVendor,
      manageTeams,
      manageRentalProducts,
      eventReport,
      vendorInvoice,
      serviceList,
      calculator,
      cancelEvent,
      rescheduleEvent,
      ticketRaised,
      payoutConfig,
      productPayout,
      servicePayout,
      techPayout,
      faq,
      tnc,
      youtube,
    ],
  );

  const isFormValid = useMemo(
    () =>
      !validateName(name) &&
      !validatePhone(phoneNumber) &&
      !validateEmail(emailId) &&
      hasAnyPermission,
    [name, phoneNumber, emailId, hasAnyPermission],
  );

  const editUser = async () => {
    if (submitting) return;
    if (!validateAll()) {
      showToast("Please fix the highlighted fields", "danger");
      return;
    }
    if (!hasAnyPermission) {
      showToast("Please select at least one access permission", "danger");
      return;
    }
    setSubmitting(true);
    try {
      const data = {
        member_name: name.trim(),
        mobile_number: phoneNumber.trim(),
        email_id: emailId.trim(),
        password: password,
        profile: profile,
        banner_management: banner,
        service_management: service,
        subservice_management: subService,
        billing_address: billingAddress,
        state: states,
        city: cities,
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
        showToast(
          res.data.message || "Team member updated successfully",
          "success",
        );
        setTimeout(() => navigate("/team/team-list"), 900);
      } else {
        showToast("Failed to update team member", "danger");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        "danger",
      );
      setSubmitting(false);
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
              <div className="labelText-0-1-734">
                Name <span style={{ color: "#dc3545" }}>*</span>
              </div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d21-0-1-1124 undefined"
                  placeholder="Enter Name"
                  type="text"
                  value={name}
                  maxLength={50}
                  autoComplete="name"
                  onChange={handleNameChange}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  style={errors.name ? invalidBorder : undefined}
                />
              </div>
              <span style={errorTextStyle}>{errors.name}</span>
            </div>
            <div className="label-0-1-733 col-md-3">
              <div className="labelText-0-1-734">
                Phone number <span style={{ color: "#dc3545" }}>*</span>
              </div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d22-0-1-1125 undefined"
                  placeholder="Enter Phone Number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  autoComplete="tel"
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur("phone")}
                  aria-invalid={!!errors.phone}
                  style={errors.phone ? invalidBorder : undefined}
                />
              </div>
              <span style={errorTextStyle}>{errors.phone}</span>
            </div>
            <div className="label-0-1-733 col-md-3">
              <div className="labelText-0-1-734">
                Email Id <span style={{ color: "#dc3545" }}>*</span>
              </div>
              <div className="inputContainer-0-1-133 undefined ">
                <input
                  className="input-0-1-134 input-d23-0-1-1126 undefined"
                  placeholder="name@example.com"
                  type="email"
                  value={emailId}
                  maxLength={100}
                  autoComplete="email"
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={!!errors.email}
                  style={errors.email ? invalidBorder : undefined}
                />
              </div>
              <span style={errorTextStyle}>{errors.email}</span>
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
              onClick={() => navigate("/team/team-list")}
              disabled={submitting}
            >
              <i className="fa-solid fa-arrow-left-long"></i> &nbsp; Back
            </Button>{" "}
            <Button
              className="ms-2 px-5"
              variant="info"
              onClick={editUser}
              disabled={submitting || !isFormValid}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  Update &nbsp;
                  <i className="fa-solid fa-arrow-right-long"></i>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          show={toast.show}
          delay={3500}
          autohide
          bg={toast.variant}
        >
          <Toast.Body style={{ color: "#fff", fontWeight: 500 }}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default EditTeam;
