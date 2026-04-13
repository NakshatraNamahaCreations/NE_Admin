const scheduleData = [
  {
    name: "Shivam",
    mobileNumber: 9664991864,
    email: "shivam@gmail.com",
    time: "05:30 AM - 07:00 PM",
    date: "2024-04-01",
    organizationName: "SAP",
    celebrity: "Dietmar Hopp",
    eventType: "Conference/Seminar",
    noOfPerson: 5,
    location: "Bangalore",
    // tableNo: "",
    // specialRequest: ""
    _id: "65af9e5dd921af70f8891df5",
  },
  {
    name: "Kiruthika",
    mobileNumber: 8526190332,
    email: "kiruthika@gmail.com",
    time: "10:00 AM - 05:00 PM",
    date: "2024-04-02",
    organizationName: "Netflix",
    celebrity: "Reed Hastings",
    eventType: "Webinar",
    noOfPerson: 50,
    location: "Chennai",
    _id: "65b0dabbc46b6d4c5b8b9266",
  },
  {
    name: "Arush Gangwar",
    mobileNumber: 8533801129,
    email: "arushgangwar@gmail.com",
    time: "05:30 PM - 07:00 PM",
    date: "2024-04-04",
    organizationName: "JPMorgan Chase & Co",
    celebrity: "Jeremy Barnum,Carla Hassan",
    eventType: "Networking Event",
    noOfPerson: 25,
    location: "Bangalore",
    _id: "65b0daedc46b6d4c5b8b926a",
  },
  {
    name: "Aniket Iyengar",
    mobileNumber: 9987300004,
    email: "aniketiyengar@gmail.com",
    time: "05:30 PM - 07:00 PM",
    date: "2024-04-05",
    organizationName: "Data Matrix",
    celebrity: "Meena Gupta",
    eventType: "Meeting",
    noOfPerson: 5,
    location: "Bangalore",
    _id: "65b252c1772634ac8465d6fb",
  },
  {
    name: "Atul Gupta",
    mobileNumber: 9419114039,
    email: "atulgupta@gmail.com",
    time: "05:30 AM - 07:00 PM",
    date: "2024-04-24",
    organizationName: "Blaash.io",
    celebrity: "Mohit Bansal",
    eventType: "Promotion",
    noOfPerson: 100,
    location: "Bangalore",
    _id: "65c380862db6b64426f12318",
  },
];

const invoiceData = [
  {
    itemName: "Catering",
    quantity: 110,
    rate: 5000,
    tax: 0,
    amount: 5000,
  },
  {
    itemName: "Birdsmaids Bouquet",
    quantity: 110,
    rate: 2000,
    tax: 18,
    amount: 2460,
  },
  {
    itemName: "Photography",
    quantity: 110,
    rate: 20000,
    tax: 0,
    amount: 20000,
  },
  {
    itemName: "Lightings",
    quantity: 110,
    rate: 5000,
    tax: 0,
    amount: 5000,
  },
  {
    itemName: "Speakers",
    quantity: 110,
    rate: 5000,
    tax: 0,
    amount: 5000,
  },
];

const bannerData = [
  {
    bannerImage:
      "https://c8.alamy.com/comp/2AP412X/event-management-poster-template-layout-corporate-party-planning-holiday-celebration-banner-booklet-leaflet-print-design-with-linear-icons-vecto-2AP412X.jpg",
    bannerType: "Slider",
  },
  {
    bannerImage:
      "https://www.adbanao.com/img/industryimages_new/event_planning/event_planning_01.png",
    bannerType: "Home",
  },
  {
    bannerImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/banquet-instagram-post-design-template-80be6c67beadcbe45af0866c44fe3aaa.jpg?ts=1708007777",
    bannerType: "Default",
  },
  {
    bannerImage:
      "https://www.shutterstock.com/image-vector/event-agency-birthday-party-banner-260nw-589169552.jpg",
    bannerType: "Default",
  },
  {
    bannerImage:
      "https://marketplace.canva.com/EAFJMl8KcjI/1/0/1131w/canva-purple-black-tropical-party-club-poster-orVwDS2lrfY.jpg",
    bannerType: "Home",
  },
];

const scheduleData1 = [
  {
    title: "Lois Lane",
    name: "Shivam",
    time: "09:30 AM - 10:00 PM",
    date: "2024-04-01",
    city: "Chennai",
    email: "shivam@gmail.com",
    organizationName: "SAP",
    celebrity: "Dietmar Hopp",
    eventType: "Conference/Seminar",
    noOfPerson: 5,
    location: "Bangalore",
    // tableNo: "",
    // specialRequest: ""
    _id: "65af9e5dd921af70f8891df5",
  },
  {
    title: "Clark Kent",
    time: "05:30 AM - 07:00 PM",
    date: "2024-04-01",
    city: "Mumbai",
  },
  {
    title: "Ralph",
    time: "10:00 AM - 05:00 PM",
    date: "2024-04-02",
    city: "Bangalore",
  },
  {
    title: "Alice Kramden",
    time: "05:30 PM - 07:00 PM",
    date: "2024-04-04",
    city: "Delhi",
  },
  {
    title: "Holly Golightly",
    time: "05:30 PM - 07:00 PM",
    date: "2024-04-05",
    city: "Noida",
  },
  {
    title: "Liza Doolittle",
    time: "10:30 AM - 05:30 PM",
    date: "2024-04-07",
    city: "Kolkata",
  },
  {
    title: "Henry Higgins",
    time: "10:00 AM - 07:00 PM",
    date: "2024-04-09",
    city: "Chennai",
  },
  {
    title: "Joseph Arimathea",
    time: "02:00 PM - 05:00 PM",
    date: "2024-04-09",
    city: "Mysore",
  },
  {
    title: "Mary Magdalene",
    time: "03:30 PM - 10:00 PM",
    date: "2024-04-08",
    city: "Hydrabad",
  },
  {
    title: "Joseph Arimathea",
    time: "08:30 AM - 07:00 PM",
    date: "2024-04-23",
    city: "Mysore",
  },
  {
    title: "Joseph Arimathea",
    time: "9:30 AM - 08:00 PM",
    date: "2024-04-23",
    city: "Mysore",
  },
  {
    title: "Mary Magdalene",
    time: "05:30 AM - 07:00 PM",
    date: "2024-04-24",
    city: "Hydrabad",
  },
];

const product = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
  },
  {
    id: 4,
    name: "Product 4",
    price: 400,
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
  },
  {
    id: 6,
    name: "Product 6",
    price: 600,
  },
  {
    id: 7,
    name: "Product 7",
    price: 700,
  },
  {
    id: 8,
    name: "Product 8",
    price: 800,
  },
  {
    id: 9,
    name: "Product 9",
    price: 900,
  },
  {
    id: 10,
    name: "Product 10",
    price: 1000,
  },
];

const productData = [
  {
    id: 2232,
    name: "Product 1",
    quantity: 12,
  },
  {
    id: 2231,
    name: "Product 2",
    quantity: 10,
  },
];
const orderaData = [
  {
    order_id: 1,
    product_id: 2232,
    quantity: 2,
    start_date: "04-sep-2024",
    end_date: "06-sep-2024",
  },
  {
    order_id: 2,
    product_id: 2232,
    quantity: 1,
    start_date: "04-sep-2024",
    end_date: "04-sep-2024",
  },
  {
    order_id: 3,
    product_id: 2231,
    quantity: 4,
    start_date: "05-sep-2024",
    end_date: "06-sep-2024",
  },
  {
    order_id: 4,
    product_id: 2232,
    quantity: 5,
    start_date: "04-sep-2024",
    end_date: "05-sep-2024",
  },
  {
    order_id: 5,
    product_id: 2231,
    quantity: 3,
    start_date: "04-sep-2024",
    end_date: "05-sep-2024",
  },
  {
    order_id: 6,
    product_id: 2232,
    quantity: 3,
    start_date: "06-sep-2024",
    end_date: "08-sep-2024",
  },
];

export {
  scheduleData,
  invoiceData,
  bannerData,
  scheduleData1,
  product,
  orderaData,
  productData,
};

// // Assuming you have the response from somewhere
// const response = [
//   // An array of responses with the respective times
//   "08:30 AM - 09:00 AM",
//   "10:00 AM - 12:00 PM",
//   // Add more times here as per your response
// ];

// // Assuming response length matches the scheduleData length
// const updatedScheduleData = scheduleData.map((event, index) => ({
//   ...event,
//   time: response[index], // Update the time for each event
// }));

// // Now use updatedScheduleData to create your events list
// const eventCounts = updatedScheduleData.reduce((counts, item) => {
//   const date = item.date;
//   const time = item.time;
//   const dateTimeKey = `${date} ${time}`;
//   console.log("dateTimeKey", dateTimeKey);
//   counts[date] = (counts[date] || 0) + 1;
//   return counts;
// }, {});

// const myEventsList = Object.keys(eventCounts).map((date) => ({
//   title: `${eventCounts[date]} Booking's`,
//   start: new Date(new Date(date)),
//   end: new Date(new Date(date)),
//   count: eventCounts[date],
// }));

// const handleSelectEvent = (event) => {
//   console.log("event:", event);
//   const selectedDate = moment(event.start).format("YYYY-MM-DD");
//   // navigate(`/table/${selectedDate}`);
// };
