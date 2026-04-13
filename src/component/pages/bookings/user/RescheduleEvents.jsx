import React, { useEffect, useState } from "react";
import Header from "../../../structure/Header";
import DataTable from "react-data-table-component";
import axios from "axios";
import { apiUrl } from "../../../../api-services/apiContents";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Loader from "../../../loader/Loader";

function RescheduleEvents() {
  const Navigate = useNavigate();
  const [rescheduleEvents, setRescheduledOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const severRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.RESCHEDULED_EVENTS}`,
      );
      if (severRes.status === 200) {
        console.log("severRes", severRes.data.rescheduledEvents);

        setRescheduledOrders(severRes.data.rescheduledEvents);
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const navigateToDetailedPage = (row) => {
    Navigate("/booking/booking-details", {
      state: {
        row,
      },
    });
  };

  const columns = [
    {
      name: "Booking No",
      selector: (row, index) =>
        "NE" + row._id?.substring(row._id.length - 4).toUpperCase(),
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => (
        <>
          <div
            style={
              {
                //   color: "black",
                //   fontWeight: "700",
                //   paddingBottom: "6px",
                //   cursor: "pointer",
              }
            }
            // onClick={() => handleOpeningCanvas(row)}
          >
            {row.user_name}
          </div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Event Name",
      selector: (row) => row.event_name,
    },
    {
      name: "Reason",
      selector: (row) => row.reschedule_remark,
    },
    {
      name: "Event Date & Time",
      selector: (row) => (
        <div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            {row.event_date}
          </div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            {row.event_start_time}
          </div>
        </div>
      ),
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => (
        <>
          <div
            style={{
              display: "flex",
            }}
            onClick={() => navigateToDetailedPage(row)}
          >
            <div style={{ cursor: "pointer" }} title="View">
              <FaEye size={16} color="#2F4E9E" />
              &nbsp;View
            </div>
            {/* <div>
                  <RxSlash size={16} />
                </div>
                <div style={{ cursor: "pointer" }} title="Delete">
                  <MdDelete size={16} color="#E91E63" />
                  &nbsp;Delete
                </div> */}
          </div>
        </>
      ),
      // sortable: true,
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div
        className="border-top-for-all-border p-2"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <Header />
        <div>
          <DataTable
            columns={columns}
            data={rescheduleEvents}
            pagination
            //   defaultSortFieldId={1}
          />
        </div>
      </div>
    </>
  );
}

export default RescheduleEvents;
