import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../api-services/apiContents";
import Loader from "../../loader/Loader";
import axios from "axios";
import ChipInput from "./ChipInput";
import DataTable from "react-data-table-component";
import { FaDownload } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function Requirements() {
  const [serviceListData, setServiceListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceId, setServiceId] = useState("");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const serviceRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ACTIVE_SERVICE}`,
      );
      if (serviceRes.status === 200) {
        setServiceListData(serviceRes.data.data);
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
  const requimentsList = serviceListData.filter(
    (item) => item.requirement_fields.length > 0,
  );
  // console.log("requiments", requimentsList);

  const deleteRequirementField = async (serviceId, uniqueId) => {
    console.log("fieldid:", serviceId, uniqueId);
    try {
      const response = await fetch(
        `${apiUrl.BASEURL}/service/services/${uniqueId}/delete-field`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serviceId }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        alert("Requirement field deleted successfully!");
        // console.log(data);
        fetchList();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting requirement field:", error);
    }
  };

  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Requirement Fields",
      selector: (row) => (
        <>
          <ul>
            {row.requirement_fields.map((ele) => (
              <li
                style={{
                  listStyle: "none",
                  margin: "auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                  gap: "10px",
                }}
              >
                {ele.parameter}{" "}
                <MdDelete
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteRequirementField(row._id, ele.unique_id)}
                />
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  console.log("serviceListData", serviceListData);

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
              padding: "10px 20px",
            }}
          >
            <div>
              <h6 className="mt-3" style={styles.header}>
                Select Service:
              </h6>

              <select
                style={{ padding: "5px 10px", fontSize: "14px" }}
                // value={serviceName}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">---Select Service---</option>
                {serviceListData.map((ele) => (
                  <option value={ele._id}>{ele.service_name}</option>
                ))}
              </select>
            </div>
            <h6 className="mt-3" style={styles.header}>
              Add Requirements
            </h6>
            <ChipInput serviceId={serviceId} />
          </div>
        </div>
        <div className="col-md-6">
          {/* <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "10px 20px",
            }}
          >
            <table
              style={{
                border: "1px solid #f4f4f4",
              }}
            >
              <thead>
                <tr>
                  <th>Service Name </th>
                  <th>Requirement Fields </th>
                </tr>
              </thead>
              {requimentsList.map((row) => (
                <tr>
                  <td> {row.service_name}</td>
                  <td>
                    {row.requirement_fields.map((ele, index) => (
                      <div key={index}>
                        <span style={styles.span}>{ele.parameter}</span>
                        <span style={styles.span}>
                          <MdDelete
                            onClick={() =>
                              deleteRequirementField(row._id, ele.unique_id)
                            }
                            className="ms-2 me-2"
                            style={{ cursor: "pointer" }}
                            size={16}
                            color="#2F4E9E"
                          />
                        </span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </table>
          </div> */}
          <DataTable columns={columns} data={requimentsList} pagination />
        </div>
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
  span: {
    display: "inline-block",
    margin: "5px",
  },
};
export default Requirements;
