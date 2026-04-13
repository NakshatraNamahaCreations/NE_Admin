import React, { useEffect, useState } from "react";
import Select from "react-select";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";

function Calculator() {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [selectedVendor, setSelectedVendor] = React.useState(null);
  const [inputAmount, setInputAmount] = React.useState("0");
  const [result, setResult] = React.useState(null);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_VENDOR}`);
      if (res.status === 200) {
        setVendors(res.data);
      }
      const payoutConfigRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
      );
      if (payoutConfigRes.status === 200) {
        const profile = payoutConfigRes.data.profile;
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //   console.log("vendors", vendors);

  const options = vendors.map((ele) => ({
    value: ele._id,
    label: ele.vendor_name,
  }));

  const handleSelectVendor = (selected) => {
    const vendorId = selected.value;
    const findVendor = vendors.find((item) => item._id === vendorId);
    setSelectedOption(selected);
    setSelectedVendor(findVendor ? findVendor : null);
  };

  const razorPay =
    (parseInt(inputAmount) * profileData?.razorpay_percentage) / 100;

  const userPayableAmount = parseInt(inputAmount) + parseInt(razorPay);

  const balance = parseInt(inputAmount);

  const commissionAmount =
    (parseInt(inputAmount) * (selectedVendor?.commission_percentage || 0)) /
    100;

  const commissionTaxAmount =
    (parseInt(commissionAmount) * (selectedVendor?.commission_tax || 0)) / 100;

  const netTotal = parseInt(commissionAmount) + parseInt(commissionTaxAmount);

  const payableToSeller = parseInt(inputAmount) - parseInt(netTotal);

  const tableContent = [
    {
      head: `Razorpay Fee @${
        profileData?.razorpay_percentage ? profileData?.razorpay_percentage : 0
      }%`,
      value: razorPay.toFixed(2),
      color: "#f3545d",
      fontWeight: "400",
    },
    {
      head: "User Payable Amount",
      value: userPayableAmount.toFixed(2),
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Balance ₹ (NITHYAEVENT Receipt)",
      value: balance.toFixed(2),
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Commission %",
      value: selectedVendor?.commission_percentage?.toFixed(2) || 0.0,
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Commission ₹ (NITHYAEVENT Deductions)",
      value: commissionAmount.toFixed(2),
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Commission GST %",
      value: selectedVendor?.commission_tax?.toFixed(2) || 0.0,
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Commission GST ₹",
      value: commissionTaxAmount.toFixed(2),
      color: "black",
      fontWeight: "400",
    },
    {
      head: "Net Total ₹",
      value: netTotal.toFixed(2),
      color: "black",
      fontWeight: "600",
    },
    {
      head: "Payable to Seller",
      value: payableToSeller.toFixed(2),
      color: "black",
      fontWeight: "600",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "10px 20px",
      }}
    >
      <div className="headerTitle-0-1-70">Calculator</div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        <span>Seller</span>
        <span style={{ width: "20%", marginLeft: "69px" }}>
          <Select
            options={options}
            onChange={handleSelectVendor}
            value={selectedOption}
          />
        </span>
      </div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        <span>Amount</span>
        <span style={{ marginLeft: "50px", width: "20%" }}>
          <input
            className="ps-2"
            style={{
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ccc",
              padding: "5px 2px",
            }}
            placeholder="0"
            type="number"
            min={0}
            onChange={(e) => setInputAmount(e.target.value || "0")}
          />
        </span>
      </div>
      <div className="mt-3">
        <table
          style={{
            border: "1px solid #f4f4f4",
          }}
        >
          {tableContent.map((ele) => (
            <tr style={{ borderBottom: "1px solid #f4f4f4" }}>
              <th
                style={{
                  width: "auto",
                  color: ele.color,
                  fontWeight: ele.fontWeight,
                  fontSize: "14px",
                  padding: "8px",
                }}
              >
                {ele.head}
              </th>
              <td
                style={{
                  borderLeft: "1px solid #f4f4f4",
                  padding: "8px",
                  color: ele.color,
                  fontWeight: ele.fontWeight,
                  fontSize: "14px",
                  width: "200px",
                  textAlign: "right",
                }}
              >
                {ele.value}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default Calculator;
