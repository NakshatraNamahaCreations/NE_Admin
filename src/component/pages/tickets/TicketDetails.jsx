import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import Loader from "../../loader/Loader";
import moment from "moment";
import { IoMdArrowBack } from "react-icons/io";

function TicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketDetails = location.state?.ticketDetails || null;
  console.log("ticketDetails", ticketDetails);
  const [statusType, setStatusType] = useState(ticketDetails.ticket_status);
  const [remark, setRemark] = useState(ticketDetails.remark);
  const [isLoading, setIsLoading] = useState("");
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${ticketDetails.vendor_id}`,
        );
        if (res.status === 200) {
          setVendorData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("vendorData", vendorData);

  const changeStatus = async () => {
    if (statusType === "" || !remark) {
      alert("Please add status and remark");
    } else {
      try {
        const res = await axios.put(
          `${apiUrl.BASEURL}${apiUrl.CHANGE_TICKET_STATUS}${ticketDetails._id}`,
          {
            ticket_status: statusType,
            remark: remark,
            update_date: moment().format("lll"),
          },
        );
        if (res.status === 200) {
          console.log(res.data);
          alert("Status Changed to " + statusType);
          window.location.assign("/ticketing-system");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const tickets = [
    {
      header: "User Name",
      data: ticketDetails.user_name,
    },
    {
      header: "Email ID",
      data: ticketDetails.user_email,
    },
    {
      header: "Item/Product Name",
      data: ticketDetails.product_name,
    },
    {
      header: "Reason",
      data: ticketDetails.ticket_reason,
    },
    {
      header: "Descriptions",
      data: ticketDetails.ticket_command,
    },
    {
      header: "Attachment",
      data: (
        <a
          href={ticketDetails.attachment_file}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="mt-3"
            src={`${ticketDetails.attachment_file}`}
            style={{ width: "50%" }}
          />
        </a>
      ),
    },
    {
      header: "Vendor Name",
      data: ticketDetails.vendor_name,
    },
    // {
    //   header: "Contact",
    //   data: (
    //     <>
    //       <div>+91 {vendorData.mobile_number}</div>
    //       <div style={{ color: "blue" }}>{vendorData.email}</div>
    //     </>
    //   ),
    // },
    {
      header: "Status *",
      data: (
        <>
          <select
            className="mt-1"
            onChange={(e) => setStatusType(e.target.value)}
            style={{
              borderRadius: "5px",
              border: "1px solid #ebedf2",
              padding: "5px",
            }}
            value={statusType}
          >
            <option value="">Option to select</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          {ticketDetails.update_date && (
            <div>Update At: {ticketDetails.update_date}</div>
          )}
        </>
      ),
    },
    {
      header: "Remark *",
      data: (
        <>
          <textarea
            className="mt-2"
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
            style={{
              width: "300px",
              height: "96px",
              borderRadius: "5px",
              border: "1px solid #ebedf2",
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "10px 20px",
        }}
      >
        <div className="headerTitle-0-1-70 mb-2">
          <IoMdArrowBack
            color="#4b4b4b"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          Ticket: #{ticketDetails._id}{" "}
        </div>
        <div className="mt-2">
          <table
            striped
            className="table"
            style={{
              border: "1px solid #f4f4f4",
              width: "50%",
            }}
          >
            {tickets.map((ele) => (
              <tr
                style={{
                  borderBottom: "1px solid #f4f4f4",
                }}
              >
                <th
                  style={{
                    width: "170px",
                    color: "#333",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "8px",
                  }}
                >
                  {ele.header}{" "}
                </th>
                <td
                  style={{
                    borderLeft: "1px solid #f4f4f4",
                    padding: "8px",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {ele.data}
                </td>
              </tr>
            ))}
            <tr>
              <th className="p-2">
                <Button
                  style={{
                    width: "150px",
                    backgroundColor: "#177dff",
                    border: 0,
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="ms-2"
                  onClick={changeStatus}
                >
                  Update Ticket
                </Button>{" "}
              </th>{" "}
              <th>
                <Button
                  style={{
                    width: "150px",
                    backgroundColor: "#f3545d",
                    border: 0,
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="ms-2"
                  onClick={() => window.location.assign("/ticketing-system")}
                >
                  Back
                </Button>
              </th>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
}

export default TicketDetails;
