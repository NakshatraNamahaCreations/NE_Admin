import React, { useEffect, useState } from "react";
import "../../../styles/dashboard.css";
import axios from "axios";
import { apiUrl } from "../../../api-services/apiContents";
import Loader from "../../loader/Loader";
import { get } from "../../../api-services/apiHelper";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userBookingData, setUserBookingData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [userList, setUserList] = useState([]);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_ORDER}`);
      if (res.status === 200) {
        setUserBookingData(res.data);
      }
      const data = await get(apiUrl.GET_ALL_VENDOR);
      setVendorData(data);

      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USERS_LIST}`
      );
      if (userRes.status === 200) {
        setUserList(userRes.data);
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

  useEffect(() => {
    if (userBookingData.length > 0) {
      const totalPaidAmount = userBookingData.reduce(
        (acc, value) => acc + value.paid_amount,
        0
      );
      setTotalRevenue(totalPaidAmount);
      // console.log("Total Revenue:", totalPaidAmount);
    } else {
      console.log("No booking data available.");
    }
  }, [userBookingData]);
  // console.log("totalRevenue", totalRevenue);

  return (
    <div>
      {isLoading && <Loader />}
      <div className="dashboard mt-2">
        <div className="row">
          <div className="col-md-3">
            <div className="small-box bg-aqua">
              <div className="inner">
                <h3>{userBookingData.length}</h3>
                <p>User Bookings</p>
              </div>
              <div className="icon">
                <i className="fa-solid fa-check-double"></i>
              </div>
              <a href="/booking/user-bookings" className="small-box-footer">
                More info <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
          <div className="col-md-3">
            <div className="small-box bg-yellow">
              <div className="inner">
                <h3>{vendorData.length}</h3>
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
                <h3>{userList?.length}</h3>
                <p>User</p>
              </div>
              <div className="icon">
                <i className="fa-solid fa-user-tag"></i>
              </div>
              <a href="/user-list" className="small-box-footer">
                More info <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
          <div className="col-md-3">
            <div className="small-box bg-green">
              <div className="inner">
                <h3>{totalRevenue.toFixed(2)}</h3>
                <p>Revenue</p>
              </div>
              <div className="icon">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <a href="/booking/user-bookings" className="small-box-footer">
                More info <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
