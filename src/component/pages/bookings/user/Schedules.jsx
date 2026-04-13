import moment from "moment";
import React, { useEffect, useState } from "react";
import { momentLocalizer } from "react-big-calendar";
import { Calendar } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import Loader from "../../../loader/Loader";

function Schedules() {
  const localizer = momentLocalizer(moment);
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
  // console.log("scheduleData", scheduleData);

  const eventCounts = scheduleData.reduce((counts, item) => {
    const date = moment(item.createdAt).format("YYYY-MM-DD");
    // const time = item.time;
    const dateTimeKey = `${date}`;
    console.log("dateTimeKey", dateTimeKey);
    counts[date] = (counts[date] || 0) + 1;
    return counts;
  }, {});

  //  2 const myEventsList = Object.keys(eventCounts).map((date) => ({
  //     title: `${eventCounts[date]} Booking's`,
  //     start: new Date(new Date(date).setHours(0, 0, 0, 0)),
  //     end: new Date(new Date(date).setHours(0, 0, 0, 0)),
  //     count: eventCounts[date],
  //   }));
  const myEventsList = Object.keys(eventCounts).map((date) => {
    const eventsOnDate = scheduleData.filter(
      (item) => moment(item.createdAt).format("YYYY-MM-DD") === date,
    );
    // const time = eventsOnDate.map((event) => event.time).join(", ");

    return {
      title: `${eventCounts[date]} Booking's`,
      start: new Date(date),
      end: new Date(date),
      count: eventCounts[date],
      // time: time, // Include the time from scheduleData
    };
  });

  // 1  const myEventsList = Object.keys(eventCounts)
  //     .map((date) => {
  //       // Filter scheduleData for events on this date
  //       const eventsOnDate = scheduleData.filter((item) => item.date === date);

  //       // Map over the events on this date to create event objects for myEventsList
  //       return eventsOnDate.map((event) => ({
  //         title: `${eventCounts[date]} Booking's`,
  //         start: new Date(`${date} ${event.time.split(" - ")[0]}`), // Using event time
  //         end: new Date(`${date} ${event.time.split(" - ")[1]}`), // Using event time
  //         count: eventCounts[date],
  //       }));
  //     })
  //     .flat(); // Flatten the array of arrays into a single array

  const handleSelectEvent = (event) => {
    console.log("event:", event);
    const selectedDate = moment(event.start).format("DD-MM-YYYY");
    console.log("booking/booking-history?selectedDate=" + selectedDate);
    navigate(`/booking/booking-history/${selectedDate}`);
  };

  return (
    <div className="mt-3">
      {isLoading && <Loader />}
      <div style={{ backgroundColor: "white" }}>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}

export default Schedules;
