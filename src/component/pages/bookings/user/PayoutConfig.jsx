import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../api-services/apiContents";
import Loader from "../../../loader/Loader";
import Header from "../../../structure/Header";

function PayoutConfig() {
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [gst, setGST] = useState("");
  const [cin, setCIN] = useState("");
  const [pan, setPAN] = useState("");
  const [sacCode, setSACCODE] = useState("");
  const [razorpayDeduction, setRazorpayDeduction] = useState("");
  const [tdsDeductionPerc, setTDSDeduction] = useState("");
  const [tnc, setTNC] = useState("");

  // const addMedia = () => setIsModalOpen(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
      );
      if (res.status === 200) {
        const profile = res.data;
        setProfileData(profile);
        setGST(profile.data.company_gst || "");
        setCIN(profile.data.company_cin || "");
        setPAN(profile.data.company_pan || "");
        setSACCODE(profile.data.company_saccode || "");
        setRazorpayDeduction(profile.data.razorpay_percentage || 0);
        setTDSDeduction(profile.data.tds_percentage || 0);
        setTNC(profile.terms_and_conditions || ""); //due to package problem not showing
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("cin", cin);

  useEffect(() => {
    fetchData();
  }, []);

  // const handleCompanyNameChange = (e) => {
  //   setGST(e.target.value);
  // };

  console.log("profileData", profileData);

  const addProfile = async () => {
    if (!gst || !cin || !pan || !razorpayDeduction || !tdsDeductionPerc) {
      alert("Please fill all the fields.");
      return;
    }
    const data = {
      company_gst: gst,
      company_cin: cin,
      company_pan: pan,
      company_saccode: sacCode,
      razorpay_percentage: razorpayDeduction,
      tds_percentage: tdsDeductionPerc,
      terms_and_conditions: tnc,
    };
    try {
      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_PAYOUT_CONFIG}`,
        data,
      );

      if (res.status === 200) {
        console.log("res", res.data);
        alert(res.data.message || "Added");
        console.log("POST Request Success:", res);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const addSocialMediaLink = async () => {
  //   if (!mediaName || !mediaUrl) {
  //     alert("Please enter media name and media url to add social media link");
  //     return;
  //   }
  //   const data = {
  //     social_media_name: mediaName,
  //     social_media_url: mediaUrl,
  //   };

  //   try {
  //     const res = await axios.put(
  //       `${apiUrl.BASEURL}${apiUrl.ADD_SOCIAL_MEDIA}${profileData._id}`,
  //       data
  //     );
  //     if (res.status === 200) {
  //       alert("Added");
  //       console.log("PUT Request Success:", res);
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

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
              GST<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={gst}
                onChange={(e) => setGST(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              CIN<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={cin}
                onChange={(e) => setCIN(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              PAN<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={pan}
                onChange={(e) => setPAN(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>SAC CODE</div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={sacCode}
                onChange={(e) => setSACCODE(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              Razorpay Deduction Percentage
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={razorpayDeduction}
                type="number"
                min={0}
                onChange={(e) => setRazorpayDeduction(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>
              TDS Percentage<span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <input
                style={styles.input}
                value={tdsDeductionPerc}
                type="number"
                min={0}
                onChange={(e) => setTDSDeduction(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* due to package issue it was commanded */}
        {/* <div className="row py-1" style={{ alignItems: "center" }}>
          <div className="col-md-3">
            <div style={styles.leftFont}>Terms and Conditions</div>
          </div>
          <div className="col-md-6">
            <div>
              <CKEditor
                editor={ClassicEditor}
                data={tnc}
                config={{
                  toolbar: {
                    items: ["undo", "redo", "|", "bold", "italic"],
                  },
                  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setTNC(data);
                }}
              />
            </div>
          </div>
        </div> */}
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
  tableHead: {
    backgroundColor: "#cecece",
    textAlign: "center",
    whiteSpace: "nowrap",
    fontSize: "13px",
  },
};
export default PayoutConfig;
