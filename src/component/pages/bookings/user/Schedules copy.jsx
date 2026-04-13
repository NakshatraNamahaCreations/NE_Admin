import moment from "moment";
import React from "react";
import { momentLocalizer } from "react-big-calendar";
import { Calendar } from "react-big-calendar";
import { scheduleData } from "../../../../global-data/booking";
import { useNavigate } from "react-router-dom";

function Schedules() {
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const currentDate = moment().format("dddd, MM/DD/YYYY");

  const eventCounts = scheduleData.reduce((counts, item) => {
    // const date = item.date;
    // counts[date] = (counts[date] || 0) + 1;
    // return counts;
    const date = item.date;
    const time = item.time;
    const dateTimeKey = `${date} ${time}`; // Combine date and time into a single key
    counts[dateTimeKey] = (counts[dateTimeKey] || 0) + 1; // Increment count for combined key
    return counts;
  }, {});

  const myEventsList = Object.keys(eventCounts).map((date) => ({
    title: `${eventCounts[date]} Booking's`,
    // start: new Date(date),
    // end: new Date(date),
    start: new Date(new Date(date).setHours(0, 0, 0, 0)),
    end: new Date(new Date(date).setHours(0, 0, 0, 0)),
    count: eventCounts[date],
  }));
  //   console.log("myEvent", myEventsList);
  const handleSelectEvent = (event) => {
    console.log("evets mana===", event.start);
    const selectedDate = moment(event.start).format("YYYY-MM-DD");
    // navigate(`/table/${selectedDate}`);
  };

  return (
    <div className="mt-3">
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
  );
}

export default Schedules;
