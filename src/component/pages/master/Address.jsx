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
import { Button, Modal } from "react-bootstrap";

function Address() {
  const [stateName, setStateName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [cityName, setCityName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [searchName, setSearchName] = useState("");
  const [cityListData, setCityListData] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchName);
  const [filteredCities, setFilteredCities] = useState([]);
  const [allAddress, setAllAddress] = useState([]);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const stateRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ACTIVE_STATE}`,
      );
      if (stateRes.status === 200) {
        setStateList(stateRes.data.data.reverse());
      }
      const cityRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ACTIVE_CITIES}`,
      );
      if (cityRes.status === 200) {
        setCityListData(cityRes.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdres = async () => {
    try {
      const addressRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ADDRESS}`,
      );
      if (addressRes.status === 200) {
        setAllAddress(addressRes.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("allAddress", allAddress);

  useEffect(() => {
    fetchList();
    fetchAdres();
  }, []);

  const handleStateChange = (e) => {
    const selectedId = e.target.value;
    const stateItem = stateList.find((item) => item._id === selectedId);
    if (stateItem) {
      setSelectedStateId(selectedId);
      setStateName(stateItem.state_name);
    }
    const filtered = cityListData.filter(
      (city) => city.state_id === selectedId,
    );
    setFilteredCities(filtered);
    setCityName("");
    setSelectedCityId("");
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const cityId = e.target.value;

    // Find the selected city from the city list
    const cityItem = cityListData.find((item) => item._id === cityId);

    // Update city name and ID
    if (cityItem) {
      setCityName(cityItem.city_name);
      setSelectedCityId(cityItem._id);
    }
  };

  const addAddress = async () => {
    if (!cityName || !stateName) {
      alert("City and State should not empty");
    } else {
      try {
        const data = {
          city_name: cityName,
          state_id: selectedStateId,
          city_id: selectedCityId,
          state_name: stateName,
          address: address,
          contact_email: contactEmail,
          contact_phone: contactPhone,
        };
        const res = await postData(`${apiUrl.ADD_ADDRESS}`, data);
        if (res) {
          alert("Address Added");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const deleteCity = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_ADDRESS}${id}`,
      );
      if (res.status === 200) {
        alert("Address Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const activeStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ADDRESS_ACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchAdres();
        alert(res.data.message || "State status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
    }
  };

  const inActiveStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ADDRESS_INACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchAdres();
        alert(res.data.message || "State status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
    }
  };

  const columns = [
    // {
    //   name: "Sl.No",
    //   selector: (row, index) => index + 1,
    // },
    {
      name: "State",
      selector: (row) => row.state_name,
    },
    {
      name: "City",
      selector: (row) => row.city_name,
    },
    {
      name: "Address",
      selector: (row) => row.address,
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
              title="Edit"
            >
              <MdEdit size={16} color="white" />
            </div> */}
            <div
              style={{
                backgroundColor: row.isAddressActive ? "#35cd3a" : "#2f4e9e",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              title={row.isAddressActive ? "Active" : "Inactive"}
            >
              {row.isAddressActive ? (
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

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchName), 300);
    return () => clearTimeout(timeout);
  }, [searchName]);

  const filteredData = allAddress.filter(
    (service) =>
      service.state_name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      service.city_name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div>
      {isLoading && <Loader />}

      <div className="mt-2">
        {!isLoading && (
          <div
            className="border-top-for-all-border"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <div>
              <div
                className="p-3"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div>
                  <button
                    style={styles.buttonForEveything}
                    onClick={() => setModalShow(true)}
                  >
                    Add Address
                  </button>
                </div>
                <div style={{ justifyContent: "flex-end" }}>
                  <input
                    className="ms-1"
                    placeholder="Search city/state"
                    style={{
                      border: "1px solid #ebedf2",
                      padding: "2px 5px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <DataTable columns={columns} data={filteredData} pagination />
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-2">
            <div className="row mt-2">
              <div className="col-md-4">
                <label className="form-label">
                  State <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <select
                  style={styles.borderItems}
                  onChange={handleStateChange}
                  value={selectedStateId}
                >
                  <option>---Select---</option>
                  {stateList.map((ele) => (
                    <option key={ele._id} value={ele._id}>
                      {ele.state_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <label className="form-label">
                  City <span style={{ color: "red" }}>*</span>{" "}
                </label>
              </div>
              <div className="col-md-8">
                <select
                  style={styles.borderItems}
                  onChange={handleCityChange}
                  value={selectedCityId}
                >
                  <option value="">---Select City---</option>
                  {filteredCities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <label className="form-label">
                  Contact Email <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <input
                  style={styles.borderItems}
                  onChange={(e) => setContactEmail(e.target.value)}
                  type="text"
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <label className="form-label">
                  Contact Phone <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <input
                  style={styles.borderItems}
                  onChange={(e) => setContactPhone(e.target.value)}
                  type="text"
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label className="form-label">
                  Address <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <textarea
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.borderItems}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addAddress}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const styles = {
  buttonForEveything: {
    backgroundColor: "#609ecc",
    border: "#7ac536",
    color: "white",
    borderRadius: "3px",
    fontSize: "14px",
    padding: "5px 10px",
  },
  borderItems: {
    border: "1px solid rgb(235, 237, 242)",
    padding: "4px",
    width: "100%",
    borderRadius: "5px",
  },
};

export default Address;
