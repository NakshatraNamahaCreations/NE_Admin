import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";

function TicketListing() {
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState("");

  const getTicketListings = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_All_TICKET}`);
      if (res.status === 200) {
        setTicketList(res.data.data.reverse());
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTicketListings();
  }, []);

  const viewTicketDetails = (row) => {
    Navigate("/ticketing-details", {
      state: {
        ticketDetails: row,
      },
    });
  };

  const filterData = ticketList.filter((t) => {
    const f = (filterByStatus || "").toLowerCase().trim();

    // ✅ if filter is empty OR "all" => return all data
    if (!f || f === "all") return true;

    return (t.ticket_status || "").toLowerCase().includes(f);
  });

  console.log("filterData", filterData);

  const columns = [
    {
      name: "Ticket #",
      selector: (row) => row._id,
      //   sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.ticket_created_date,
      //   sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.user_name,
      //   sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user_email,
      //   sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.ticket_reason,
      //   sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge
          bg={
            row.ticket_status === "Closed"
              ? "secondary"
              : row.ticket_status === "Resolved"
                ? "success"
                : row.ticket_status === "Pending"
                  ? "primary"
                  : "warning"
          }
        >
          {row.ticket_status}
        </Badge>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div
          style={{
            cursor: "pointer",
            backgroundColor: "#2f4e9e",
            padding: "7px 13px",
          }}
          title="View"
          onClick={() => viewTicketDetails(row)}
        >
          <FaEye size={16} color="white" />
        </div>
      ),
      //   sortable: true,
    },
  ];

  return (
    <div style={{ backgroundColor: "white" }}>
      <div className="d-flex p-2" style={{ justifyContent: "space-between" }}>
        <div className="headerTitle-0-1-70 mb-2">
          Ticket List({ticketList.length}){" "}
        </div>
        <div className="me-4">
          <select
            style={{
              border: "1px solid #ebedf2",
              padding: "2px 5px",
              borderRadius: "5px",
              marginTop: "10px",
            }}
            onChange={(e) => setFilterByStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Created">Created</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      {isLoading && <Loader />}
      <DataTable
        columns={columns}
        data={filterData}
        pagination
        //   defaultSortFieldId={1}
      />
    </div>
  );
}

export default TicketListing;
