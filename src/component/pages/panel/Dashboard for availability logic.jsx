import React from "react";
import "../../../styles/dashboard.css";

function Dashboard() {
  // console.log("storedUser", user);

  // Helper function to parse date strings into Date objects
  function parseDate(dateStr) {
    return new Date(dateStr.split("-").reverse().join("-"));
  }

  // Function to get available quantity of products based on selected date range
  function getAvailableQuantity(
    productData,
    orderData,
    selectedStartDate,
    selectedEndDate
  ) {
    // Parse selected dates
    const selectedStart = parseDate(selectedStartDate);
    const selectedEnd = parseDate(selectedEndDate);

    // Initialize available quantities map
    const availableQuantities = {};

    // Calculate available quantities for each product
    productData.forEach((product) => {
      // Initialize the available quantity with the total quantity
      availableQuantities[product.id] = product.quantity;

      // Calculate the total quantity booked within the selected date range
      let bookedQuantity = 0;

      orderData.forEach((order) => {
        // Parse order dates
        const orderStart = parseDate(order.start_date);
        const orderEnd = parseDate(order.end_date);

        // Check if the order overlaps with the selected date range
        if (
          order.product_id === product.id &&
          orderEnd >= selectedStart &&
          orderStart <= selectedEnd
        ) {
          bookedQuantity += order.quantity;
        }
      });

      // Update the available quantity
      availableQuantities[product.id] -= bookedQuantity;
    });

    return availableQuantities;
  }

  // Sample data
  const productData = [
    { id: 2232, name: "Product 1", quantity: 12 },
    { id: 2231, name: "Product 2", quantity: 10 },
  ];

  const orderData = [
    {
      order_id: 1,
      product_id: 2232,
      name: "Product 1",
      quantity: 2,
      start_date: "04-sep-2024",
      end_date: "06-sep-2024",
    },
    {
      order_id: 2,
      product_id: 2232,
      name: "Product 1",
      quantity: 1,
      start_date: "04-sep-2024",
      end_date: "04-sep-2024",
    },
    {
      order_id: 3,
      product_id: 2231,
      name: "Product 2",
      quantity: 4,
      start_date: "05-sep-2024",
      end_date: "06-sep-2024",
    },
    {
      order_id: 4,
      product_id: 2232,
      name: "Product 1",
      quantity: 5,
      start_date: "04-sep-2024",
      end_date: "05-sep-2024",
    },
    {
      order_id: 5,
      product_id: 2231,
      name: "Product 2",
      quantity: 3,
      start_date: "04-sep-2024",
      end_date: "05-sep-2024",
    },
    {
      order_id: 6,
      product_id: 2232,
      name: "Product 1",
      quantity: 3,
      start_date: "06-sep-2024",
      end_date: "08-sep-2024",
    },
  ];

  // Example usage
  const selectedStartDate = "05-sep-2024";
  const selectedEndDate = "07-sep-2024";
  const availableQuantities = getAvailableQuantity(
    productData,
    orderData,
    selectedStartDate,
    selectedEndDate
  );

  // console.log(availableQuantities);

  return (
    <div className="dashboard mt-2">
      <div className="row">
        <div className="col-md-3">
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>1503</h3>
              <p>Bookings</p>
            </div>
            <div className="icon">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <a href="/booking/booking-schedules" className="small-box-footer">
              More info <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="small-box bg-yellow">
            <div className="inner">
              <h3>1503</h3>
              <p>Vendor</p>
            </div>
            <div className="icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <a href="/vendor-list" className="small-box-footer">
              More info <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="small-box bg-red">
            <div className="inner">
              <h3>503</h3>
              <p>Seller</p>
            </div>
            <div className="icon">
              <i className="fa-solid fa-user-tag"></i>
            </div>
            <a href="#" className="small-box-footer">
              More info <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="small-box bg-green">
            <div className="inner">
              <h3>1503</h3>
              <p>Revenue</p>
            </div>
            <div className="icon">
              <i className="fa-solid fa-sack-dollar"></i>
            </div>
            <a href="#" className="small-box-footer">
              More info <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
