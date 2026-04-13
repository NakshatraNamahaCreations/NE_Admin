import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../../../../styles/booking-history.css";
import { FaEye } from "react-icons/fa";
// import { RxSlash } from "react-icons/rx";
// import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// import { scheduleData } from "../../../../global-data/booking";
import moment from "moment";
import Loader from "../../../loader/Loader";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";

function BookingHistory() {
  const { date } = useParams();
  console.log("date", date);
  const Navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const serviceRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_ORDER}`,
      );
      if (serviceRes.status === 200) {
        // console.log("serviceRes", serviceRes);
        setScheduleData(serviceRes.data);
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

  const bookingData = scheduleData.filter(
    (item) => moment(item.createdAt).format("DD-MM-YYYY") === date,
  );
  const navigateToDetailedPage = (row) => {
    Navigate("/booking/booking-details", {
      state: {
        row,
      },
    });
  };

  const downloadData = () => {
    const dataToDownload = bookingData.map((item) => ({
      booking_no: "NE" + item._id?.substring(item._id.length - 4).toUpperCase(),
      user_name: item.user_name,
      event_name: item.event_name,
      event_date: item.event_date,
      event_time: item.event_start_time + ":" + item.event_end_time,
      status: item.order_status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "payment list");
    XLSX.writeFile(
      workbook,
      `Payment Report ${moment(date).format("DD/MM/YYYY")}.xlsx`,
    );
  };

  const StatusBadge = ({ label, color }) => (
    <span
      style={{
        padding: "4px 10px 7px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: color.bg,
        color: color.text,
      }}
    >
      {label}
    </span>
  );

  const handlingEventStatus = (orderData) => {
    const eventStart = moment(
      `${orderData.event_start_date} ${orderData.event_start_time}`,
      "DD-MM-YYYY hh:mm A",
    );
    const eventEnd = moment(
      `${orderData.event_end_date} ${orderData.event_end_time}`,
      "DD-MM-YYYY hh:mm A",
    );
    const nowMoment = moment();

    const colors = {
      red: { bg: "#FFEBEB", text: "#D60000" },
      green: { bg: "#E9FFEB", text: "#0A8A00" },
      blue: { bg: "#E7F0FF", text: "#004BC1" },
      orange: { bg: "#FFF4E1", text: "#D97A00" },
      grey: { bg: "#F1F1F1", text: "#555555" },
    };

    // Cancelled
    if (orderData.order_status === "Order Cancelled") {
      return <StatusBadge label="Cancelled" color={colors.red} />;
    }

    // Rescheduled
    if (orderData.order_status === "Order Rescheduled") {
      return <StatusBadge label="Rescheduled" color={colors.orange} />;
    }

    // Completed
    if (nowMoment.isSameOrAfter(eventEnd)) {
      return <StatusBadge label="Completed" color={colors.green} />;
    }

    // Ongoing
    if (nowMoment.isAfter(eventStart) && nowMoment.isBefore(eventEnd)) {
      return <StatusBadge label="Ongoing" color={colors.blue} />;
    }

    // Exactly started
    if (nowMoment.isSame(eventStart, "minute")) {
      return <StatusBadge label="Started" color={colors.blue} />;
    }

    // Not yet started (before 48 hrs)
    const date48HoursBefore = eventStart.clone().subtract(48, "hours");
    const date24HoursBefore = eventStart.clone().subtract(24, "hours");

    if (
      orderData.order_status === "Order Placed" &&
      nowMoment.isSameOrBefore(date48HoursBefore)
    ) {
      return <StatusBadge label="Upcoming" color={colors.grey} />;
    }

    if (
      orderData.order_status === "Order Placed" &&
      nowMoment.isSameOrBefore(date24HoursBefore)
    ) {
      return <StatusBadge label="Upcoming" color={colors.grey} />;
    }

    // Future event
    if (nowMoment.isBefore(eventStart)) {
      return <StatusBadge label="Order Placed" color={colors.grey} />;
    }

    return <StatusBadge label="Unknown" color={colors.grey} />;
  };

  const columns = [
    {
      name: "Order No",
      selector: (row) => row.order_id,

      sortable: true,
    },
    // {
    //   name: "Booking From",
    //   selector: (row) => row.booking_from,
    //   sortable: true,
    // },
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
      sortable: true,
    },
    {
      name: "Event Date & Time",
      selector: (row) => (
        <div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            Start Date: {row.event_start_date}
          </div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            End Date: {row.event_end_date}
          </div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            Timing: {row.event_start_time} to {row.event_end_time}
          </div>
          <div style={{ color: "black", paddingBottom: "6px" }}>
            Number of Days: {row.number_of_days}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => {
        const amt = Number(row?.paid_amount || 0);
        return `₹ ${amt.toFixed(2)}`;
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => handlingEventStatus(row),
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
  console.log("bookingData", bookingData);

  // Round to 2 decimals
  // const overAllTotal = Number(
  //   bookingData?.reduce(
  //     (acc, value) => acc + (Number(value?.paid_amount) || 0),
  //     0
  //   ).toFixed(2)
  // );

  // Avoid floating errors using Math.round
  // const overAllTotal =
  //   Math.round(
  //     bookingData?.reduce(
  //       (acc, value) => acc + (Number(value?.paid_amount) || 0),
  //       0
  //     ) * 100
  //   ) / 100;

  // Format as INR currency (if needed)
  const overAllTotal = bookingData?.reduce(
    (acc, value) => acc + (Number(value?.paid_amount) || 0),
    0,
  );

  const formattedTotal = overAllTotal.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div>
      {isLoading && <Loader />}
      <div
        style={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            backgroundColor: "#609ecc",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => Navigate("/booking/user-bookings")}
        >
          <IoMdArrowBack color="white" />
        </div>
        <div className="headerTitle-0-1-70 ms-2">
          Booking History of {moment(date).format("DD/MM/YYYY")}
        </div>
      </div>

      <div
        className="my-4"
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ cursor: "pointer" }} title="Filter">
          <input
            type="search"
            style={{
              padding: "5px",
              border: "none",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "100%",
              paddingLeft: 10,
            }}
            placeholder="Search by booking from"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div
          style={{
            backgroundColor: "#609ecc",
            padding: "5px",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          <FaDownload
            onClick={downloadData}
            className="ms-2 me-2"
            size={16}
            color="white"
          />{" "}
          Download
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookingData}
        pagination
        //   defaultSortFieldId={1}
      />
      <div className="mt-3 row justify-end">
        <span style={{ textAlign: "end" }}>
          {" "}
          <b> Overall Total Amount: ₹ {formattedTotal} </b>
        </span>
      </div>
    </div>
  );
}

export default BookingHistory;
