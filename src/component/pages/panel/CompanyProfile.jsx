import React, { useEffect, useState } from "react";
import Header from "../../structure/Header";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../../api-services/apiContents";
import Loader from "../../loader/Loader";
// import { postData } from "../../../api-services/apiHelper";

const validateCompanyName = (raw) => {
  if (raw && raw.trim() === "") return "Invalid company name"; // only spaces
  const v = (raw || "").replace(/\s+/g, " ").trim();
  if (!v) return "Company name is required";
  if (!/^[A-Za-z0-9 &.,'()-]+$/.test(v)) return "Invalid company name";
  if (!/[A-Za-z]/.test(v)) return "Invalid company name"; // numbers only
  return "";
};

const validateCorporateAddress = (raw) => {
  const v = (raw || "").replace(/\s+/g, " ").trim();
  if (!v) return "Corporate Address is required";
  if (!/[A-Za-z]/.test(v)) return "Address must contain letters";
  if (v.length < 5) return "Minimum 5 characters required";
  return "";
};

const validateEmail = (raw) => {
  const v = (raw || "").trim();
  if (!v) return "Email ID is required";
  if (/\s/.test(v)) return "Email cannot contain spaces";
  if ((v.match(/@/g) || []).length !== 1) return "Invalid email address";
  const [local] = v.split("@");
  if (local && /[^A-Za-z0-9._%+-]/.test(local))
    return "Invalid character in email";
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!re.test(v)) return "Invalid email address";
  if (v.length > 254) return "Email is too long";
  return "";
};

const validatePhone = (raw) => {
  const v = (raw || "").trim();
  if (!v) return "Phone number is required";
  const digits = v.replace(/^\+91/, "").replace(/\s/g, "");
  if (!/^[0-9]+$/.test(digits)) return "Only numbers are allowed";
  if (digits.length !== 10) return "Phone number must be 10 digits";
  return "";
};

// Website URL is optional; when provided it must be a valid http/https URL.
const validateWebsiteUrl = (raw) => {
  const hadContent = !!(raw && raw.length);
  const v = (raw || "").trim();
  if (!v) return hadContent ? "Invalid website URL" : ""; // only-spaces vs empty
  const re = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
  if (!re.test(v)) return "Invalid website URL";
  return "";
};

function CompanyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [comanyName, setComanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [siteFeviicon, setSiteFeviicon] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [footerText, setFooterText] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [errors, setErrors] = useState({});

  const addMedia = () => setIsModalOpen(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_PROFILE}`);
      if (res.status === 200) {
        const profile = res.data.profile;
        setProfileData(profile);
        setComanyName(profile.company_name || "");
        setCompanyAddress(profile.corporate_address || "");
        setContactPhone(profile.contact_phone || "");
        setContactEmail(profile.contact_email || "");
        setCompanyLogo(profile.company_logo || "");
        setSiteFeviicon(profile.site_favicon || "");
        setWebsiteUrl(profile.website_url || "");
        setFooterText(profile.footer_text || "");
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("companyLogo", companyLogo);

  useEffect(() => {
    fetchData();
  }, []);

  // const handleCompanyNameChange = (e) => {
  //   setComanyName(e.target.value);
  // };

  console.log("profileData", profileData);

  const addProfile = async () => {
    const nextErrors = {
      companyName: validateCompanyName(comanyName),
      companyAddress: validateCorporateAddress(companyAddress),
      contactPhone: validatePhone(contactPhone),
      contactEmail: validateEmail(contactEmail),
      websiteUrl: validateWebsiteUrl(websiteUrl),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((e) => e)) return;

    const formData = new FormData();

    formData.append("company_name", comanyName);
    if (companyLogo) formData.append("company_logo", companyLogo);
    if (siteFeviicon) formData.append("site_favicon", siteFeviicon);
    formData.append("website_url", websiteUrl);
    formData.append("footer_text", footerText);
    formData.append("corporate_address", companyAddress);
    formData.append("contact_phone", contactPhone);
    formData.append("contact_email", contactEmail);

    try {
      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_PROFILE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200) {
        alert("Profile Added");
        console.log("POST Request Success:", res);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addSocialMediaLink = async () => {
    if (!mediaName || !mediaUrl) {
      alert("Please enter media name and media url to add social media link");
      return;
    }
    const data = {
      social_media_name: mediaName,
      social_media_url: mediaUrl,
    };

    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ADD_SOCIAL_MEDIA}${profileData._id}`,
        data,
      );
      if (res.status === 200) {
        alert("Added");
        console.log("PUT Request Success:", res);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}/company-profile/link/${profileData._id}/social-media/${id}`,
      );
      if (res.status === 200) {
        alert("Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="border-top-for-all-border"
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
      }}
    >
      {isLoading && <Loader />}
      <div
        className="ps-3 py-3"
        style={{ borderBottom: "1px solid rgb(244, 244, 244)" }}
      >
        <Header />
      </div>
      <div className="p-3">
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Company Name<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div style={styles.leftFont}>
              <input
                style={styles.input}
                value={comanyName}
                onChange={(e) => {
                  setComanyName(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    companyName: validateCompanyName(e.target.value),
                  }));
                }}
                onBlur={(e) => {
                  const t = e.target.value.replace(/\s+/g, " ").trim();
                  setComanyName(t);
                  setErrors((p) => ({ ...p, companyName: validateCompanyName(t) }));
                }}
              />
              {errors.companyName && (
                <div style={styles.errorText}>{errors.companyName}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Corporate Address<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div style={styles.leftFont}>
              <textarea
                style={styles.input}
                value={companyAddress}
                onChange={(e) => {
                  setCompanyAddress(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    companyAddress: validateCorporateAddress(e.target.value),
                  }));
                }}
                onBlur={(e) => {
                  const t = e.target.value.replace(/\s+/g, " ").trim();
                  setCompanyAddress(t);
                  setErrors((p) => ({
                    ...p,
                    companyAddress: validateCorporateAddress(t),
                  }));
                }}
              />
              {errors.companyAddress && (
                <div style={styles.errorText}>{errors.companyAddress}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>Company Logo</div>
          </div>
          <div className="col-md-9">
            <div className="d-flex">
              <img
                src={companyLogo || "../../../../../default-fallback-image.png"}
                style={{
                  maxWidth: "50%",
                  maxHeight: "150px",
                  display: "block",
                  marginBottom: "15px",
                  boxShadow: "0 1px 15px 1px rgba(39, 39, 39, .1)",
                  height: "auto",
                }}
              />
              <div style={{ marginLeft: ".5rem" }}>
                <p style={styles.textMuted}>Dimensions: 500px × 500px</p>
                <p style={styles.textMuted}>Format: jpeg / png / webp</p>
                <p style={styles.textMuted}>Max size: 8MB</p>
              </div>
            </div>
            <div
              className="form-file-label-group"
              style={{ width: "100%", height: "100%", zIndex: 1 }}
            >
              <input
                type="file"
                className="form-control form-control-file"
                id="input-company_logo"
                name="profile_logo"
                accept="image/jpeg, image/png, image/webp"
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                }}
                onChange={(e) => {
                  // console.log("company logo", e.target.files[0]);
                  setCompanyLogo(e.target.files[0]);
                }}
              />
              <label
                htmlFor="input-company_logo"
                className="label-input-file btn btn-default btn-round"
                style={{
                  backgroundColor: "#282a3c",
                  color: "#fff",
                  borderRadius: "100px !important",
                  fontSize: "13px",
                }}
              >
                <span className="btn-label">
                  <i className="fa fa-file-image"></i>
                </span>{" "}
                Upload an Image
              </label>
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Site Favicon
              <br />
              <small style={{ color: "#6c757d", fontSize: "12px" }}>
                Must be square
              </small>
            </div>
          </div>
          <div className="col-md-9">
            <div className="d-flex">
              <img
                src={
                  siteFeviicon || "../../../../../default-fallback-image.png"
                }
                style={{
                  maxWidth: "50%",
                  maxHeight: "150px",
                  display: "block",
                  marginBottom: "15px",
                  boxShadow: "0 1px 15px 1px rgba(39, 39, 39, .1)",
                  height: "auto",
                }}
              />
              <div style={{ marginLeft: ".5rem" }}>
                <p style={styles.textMuted}>Dimensions: 200px × 200px</p>
                <p style={styles.textMuted}>Format: jpeg / png / webp</p>
                <p style={styles.textMuted}>Max size: 8MB</p>
              </div>
            </div>
            <div
              className="form-file-label-group"
              style={{ width: "100%", height: "100%", zIndex: 1 }}
            >
              <input
                type="file"
                className="form-control form-control-file"
                id="input-site_favicon"
                name="site_favicon"
                accept="image/jpeg, image/png, image/webp"
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                }}
                onChange={(e) => {
                  console.log("site feviivon", e.target.files[0]);
                  setSiteFeviicon(e.target.files[0]);
                }}
              />
              <label
                htmlFor="input-site_favicon"
                className="label-input-file btn btn-default btn-round"
                style={{
                  backgroundColor: "#282a3c",
                  color: "#fff",
                  borderRadius: "100px !important",
                  fontSize: "13px",
                }}
              >
                <span className="btn-label">
                  <i className="fa fa-file-image"></i>
                </span>{" "}
                Upload an Image
              </label>
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Contact Phone<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={contactPhone}
                maxLength={15}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    contactPhone: validatePhone(e.target.value),
                  }));
                }}
                onBlur={(e) => {
                  const t = e.target.value.trim();
                  setContactPhone(t);
                  setErrors((p) => ({ ...p, contactPhone: validatePhone(t) }));
                }}
              />
              {errors.contactPhone && (
                <div style={styles.errorText}>{errors.contactPhone}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Contact Email<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={contactEmail}
                maxLength={254}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    contactEmail: validateEmail(e.target.value),
                  }));
                }}
                onBlur={(e) => {
                  const t = e.target.value.trim();
                  setContactEmail(t);
                  setErrors((p) => ({ ...p, contactEmail: validateEmail(t) }));
                }}
              />
              {errors.contactEmail && (
                <div style={styles.errorText}>{errors.contactEmail}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>Website URL</div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    websiteUrl: validateWebsiteUrl(e.target.value),
                  }));
                }}
                onBlur={(e) => {
                  const t = e.target.value.trim();
                  setWebsiteUrl(t);
                  setErrors((p) => ({ ...p, websiteUrl: validateWebsiteUrl(t) }));
                }}
              />
              {errors.websiteUrl && (
                <div style={styles.errorText}>{errors.websiteUrl}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Social Links
              <br />
              <button
                class="btn btn-info btn-sm input-list-add mt-1"
                onClick={addMedia}
              >
                <i class="fa fa-plus"></i> Add
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <table
              class="table table-sm table-bordered input-list-container"
              id="input-table-contact_social_links"
              data-name="contact_social_links"
              data-list-max=""
              data-select2-id="input-table-contact_social_links"
            >
              <thead>
                <tr>
                  <th style={styles.tableHead} width="100px">
                    Sl. No
                  </th>
                  <th style={styles.tableHead}>Social Media</th>
                  <th style={styles.tableHead}>Link</th>
                  <th style={styles.tableHead} width="70px">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody class="input-group-list">
                {profileData.social_media?.map((ele, index) => (
                  <tr class="input-group-list-item">
                    <td class="text-center" style={{ fontSize: "14px" }}>
                      <span class="input-list-serial">{index + 1} </span>
                    </td>
                    <td style={{ textAlign: "center", fontSize: "14px" }}>
                      <span class="select2-icon">{ele.social_media_name}</span>
                    </td>
                    <td style={{ textAlign: "center", fontSize: "14px" }}>
                      <div style={{ width: "100px" }}>
                        {ele.social_media_url}
                      </div>
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-outline-danger btn-sm input-list-remove"
                        type="button"
                        onClick={() => deleteService(ele._id)}
                      >
                        <i class="fa fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tfoot>
                <tr>
                  <td colspan="4">
                    <button
                      class="btn btn-info btn-sm input-list-add"
                      type="button"
                    >
                      <i class="fa fa-plus"></i> Add Row
                    </button>
                  </td>
                </tr>
              </tfoot> */}
            </table>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>Ticket Footer Text</div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={{
                  border: "1px solid rgb(235, 237, 242)",
                  padding: ".6rem 1rem",
                  borderRadius: "5px",
                  width: "100%",
                }}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid rgb(244, 244, 244)" }}></div>
      <div className="p-3">
        <button
          className="btn btn-info btn-sm input-list-remove"
          type="button"
          style={{ backgroundColor: "#609ecc" }}
          onClick={addProfile}
        >
          Submit
        </button>
      </div>
      <Modal
        size="md"
        centered
        onHide={() => setIsModalOpen(false)}
        show={isModalOpen}
      >
        <Modal.Header closeButton>
          <div style={{ fontSize: "15px" }}>
            <b>Add Social Links</b>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2">
            <lable style={{ fontSize: "14px" }}>
              Social Media <span style={{ color: "red" }}>*</span>{" "}
            </lable>
            <br />
            <input
              style={{
                border: "1px solid rgb(235, 237, 242)",
                padding: "6px 12px",
                borderRadius: "5px",
                width: "100%",
              }}
              onChange={(e) => setMediaName(e.target.value)}
            />
            {/* <select
              class="form-control select-widget select2-hidden-accessible"
              aria-hidden="true"
              style={{ fontSize: "14px" }}
              onChange={(e) => setMediaName(e.target.value)}
            >
              <option value="">---Select---</option>
              <option value="Facebook">Facebook</option>
              <option value="X-twitter">X (Twitter)</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">Youtube</option>
            </select> */}
            <lable style={{ fontSize: "14px" }}>
              Link <span style={{ color: "red" }}>*</span>{" "}
            </lable>
            <br />
            <input
              style={{
                border: "1px solid rgb(235, 237, 242)",
                padding: "6px 12px",
                borderRadius: "5px",
                width: "100%",
              }}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            <br /> <br />
            <button
              className="btn btn-info btn-sm input-list-remove"
              type="button"
              style={{ backgroundColor: "#609ecc" }}
              onClick={addSocialMediaLink}
            >
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
const styles = {
  input: {
    border: "1px solid rgb(235, 237, 242)",
    padding: ".6rem 1rem",
    borderRadius: "5px",
    width: "60%",
  },
  textMuted: {
    color: "#6c757d",
    marginBottom: 0,
    fontSize: "13px",
  },
  leftFont: {
    fontSize: "14px",
  },
  errorText: {
    color: "red",
    fontSize: "12px",
    marginTop: "3px",
  },
  tableHead: {
    backgroundColor: "#cecece",
    textAlign: "center",
    whiteSpace: "nowrap",
    fontSize: "13px",
  },
};
export default CompanyProfile;
