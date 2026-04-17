import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import { postData } from "../../../api-services/apiHelper";
import Loader from "../../loader/Loader";
import * as XLSX from "xlsx";
import { FaCheckCircle } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useConfirm } from "../../common/ConfirmProvider";

function City() {
  const confirm = useConfirm();
  const [stateName, setStateName] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [cityListData, setCityListData] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [debouncedSearchCity, setDebouncedSearchCity] = useState(searchCity);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_CITY}`);
      if (res.status === 200) {
        setCityListData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchState = async () => {
    setIsLoading(true);
    try {
      const stateRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ACTIVE_STATE}`,
      );
      if (stateRes.status === 200) {
        setStateList(stateRes.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchState();
  }, []);

  const handleStateChange = (value) => {
    const stateItem = stateList.find((item) => item._id === value);
    setStateName(stateItem.state_name);
    setStateId(stateItem._id);
  };
  // console.log("stateList", stateList);

  const addCity = async () => {
    if (!cityName || !stateName) {
      alert("City and State should not empty");
    } else {
      try {
        const data = {
          city_name: cityName,
          state_id: stateId,
          state_name: stateName,
          city_code: cityCode,
        };
        const res = await postData(`${apiUrl.ADD_CITY}`, data);
        if (res) {
          alert("City Added");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const deleteCity = async (id) => {
    const ok = await confirm({
      title: "Delete City",
      message: "Are you sure you want to delete this city? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_CITY}${id}`,
      );
      if (res.status === 200) {
        alert("City Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const activeStatus = async (id) => {
    const ok = await confirm({
      title: "Activate City",
      message: "Are you sure you want to change the status to Active?",
      confirmText: "Yes, Activate",
      cancelText: "No",
      variant: "success",
    });
    if (!ok) return;
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.CITY_ACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchList();
        alert(res.data.message || "City status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
    }
  };

  const inActiveStatus = async (id) => {
    const ok = await confirm({
      title: "Deactivate City",
      message: "Are you sure you want to change the status to Inactive?",
      confirmText: "Yes, Deactivate",
      cancelText: "No",
      variant: "warning",
    });
    if (!ok) return;
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.CITY_INACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchList();
        alert(res.data.message || "City status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
    }
  };

  const columns = [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
    },

    {
      name: "State",
      selector: (row) => row.state_name,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city_name,
      sortable: true,
    },
    {
      name: "City Code",
      selector: (row) => row.city_code,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <div style={{ display: "flex" }}>
            {/* <div
              style={{
                backgroundColor: "#ffa534",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              // onClick={() => editTeam(row._id)}
              title="Edit"
            >
              <MdEdit size={16} color="white" />
            </div> */}
            <div
              style={{
                backgroundColor: row.isCityActive ? "#35cd3a" : "#2f4e9e",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              title={row.isCityActive ? "Active" : "Inactive"}
            >
              {row.isCityActive ? (
                <FaCheckCircle
                  onClick={() => inActiveStatus(row._id)}
                  size={16}
                  color="white"
                />
              ) : (
                <MdBlock
                  size={16}
                  onClick={() => activeStatus(row._id)}
                  color="white"
                />
              )}
            </div>
            <div
              style={{
                backgroundColor: "#E91E63",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              onClick={() => deleteCity(row._id)}
              title="Delete"
            >
              <MdDelete size={16} color="white" />
            </div>
          </div>
        </>
      ),
    },
  ];
  const downloadDataset = () => {
    const dataToDownload = cityListData.map((item) => ({
      service_name: item.service_name, // Include only the service_name field
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service List");
    XLSX.writeFile(workbook, "service-list.xlsx");
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchCity(searchCity), 300);
    return () => clearTimeout(timeout);
  }, [searchCity]);

  const filteredCityListData = cityListData.filter(
    (service) =>
      service.state_name
        .toLowerCase()
        .includes(debouncedSearchCity.toLowerCase()) ||
      service.city_code
        .toLowerCase()
        .includes(debouncedSearchCity.toLowerCase()) ||
      service.city_name
        .toLowerCase()
        .includes(debouncedSearchCity.toLowerCase()),
  );

  return (
    <div>
      {isLoading && <Loader />}

      <div className="row mt-2">
        <div className="col-md-6">
          <div
            className="border-top-for-all-border"
            style={{
              backgroundColor: "white",

              // rgb(95 95 95)
              borderRadius: "5px",
            }}
          >
            <div className="p-2">
              <div>
                <h6 className="mt-3" style={styles.header}>
                  Select State:
                </h6>
                <select
                  style={{
                    fontSize: "14px",
                    padding: "4px 7px",
                    width: "175px",
                  }}
                  onChange={(e) => handleStateChange(e.target.value)}
                >
                  <option value="">---Select---</option>
                  {stateList.map((ele) => (
                    <option key={ele._id} value={ele._id}>
                      {ele.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h6 className="mt-3" style={styles.header}>
                  City Name:
                </h6>
                <input
                  type="text"
                  value={cityName}
                  placeholder="e.g. Bangalore"
                  onChange={(e) => setCityName(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div>
                <h6 className="mt-3" style={styles.header}>
                  City Code:
                </h6>
                <input
                  type="text"
                  value={cityCode}
                  placeholder="e.g. blr"
                  onChange={(e) => setCityCode(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              {/* <div>
                <h6 className="mt-3" style={styles.header}>
                  Service Image:
                </h6>

                <input
                  type="file"
                  accept="image/png"
                  placeholder="e.g. Catering Service"
                  onChange={(e) => setServiceImage(e.target.files[0])}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div> */}
              <div className="mt-3 mb-2">
                <button onClick={addCity} style={styles.buttonForEveything}>
                  Add City
                </button>
              </div>
              {/* <div
                style={{
                  borderBottom: "1px solid #f4f4f4",
                }}
              ></div>
              <p className="mt-1" style={{ fontSize: "12px", color: "blue" }}>
                <b>*Add multiple services through excel</b>
              </p>
              <div className="mb-2 d-flex">
                <button
                  className="me-2"
                  onClick={downloadExcel}
                  style={styles.buttonForEveything}
                >
                  Download excel
                </button>
                <input
                  type="file"
                  placeholder="Upload file"
                  onChange={uploadFile}
                />
                <button onClick={addExcel} style={styles.buttonForEveything}>
                  Add
                </button>
              </div> */}
            </div>
          </div>
        </div>
        {!isLoading && (
          <div className="col-md-6">
            <div
              className="border-top-for-all-border"
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              <div className="p-2">
                <div
                  className="p-3"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div>
                    <h3 style={styles.itemsHead}>City List</h3>
                  </div>
                  <div style={{ justifyContent: "flex-end" }}>
                    {/* <b style={{ fontSize: "12px" }}>Search: </b> */}
                    <input
                      className="ms-1"
                      placeholder="Search city/state/city code"
                      style={{
                        border: "1px solid #ebedf2",
                        padding: "2px 5px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) => setSearchCity(e.target.value)}
                    />{" "}
                    {/* <FaDownload
                      onClick={downloadDataset}
                      className="ms-2 me-2"
                      style={{ cursor: "pointer" }}
                      size={16}
                      color="#2F4E9E"
                    /> */}
                  </div>
                </div>

                <div>
                  <DataTable
                    columns={columns}
                    data={filteredCityListData}
                    pagination
                    //   defaultSortFieldId={1}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  itemsHead: {
    color: "#333",
    fontWeight: "500",
    fontSize: "17px",
  },
  header: {
    color: "#333",
    fontSize: "14px",
  },
  selector: {
    color: "#555",
    width: "100%",
    padding: "6px 12px",
    border: "1px solid #ccc",
  },
  buttonForEveything: {
    backgroundColor: "#609ecc",
    border: "#7ac536",
    color: "white",
    borderRadius: "3px",
    fontSize: "14px",
    padding: "5px 10px",
  },
};

export default City;
