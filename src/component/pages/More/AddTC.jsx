import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";

function AddTC() {
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");

  const addTNC = async () => {
    if (!selectedType) {
      alert("Select Type should not be empty");
      return; // Exit early if selectedType is empty
    }

    try {
      const data = {
        selected_type: selectedType,
        title: title,
        description: paragraph,
      };

      const res = await axios.post(`${apiUrl.BASEURL}${apiUrl.SAVE_TNC}`, data);

      if (res) {
        alert("Added");
        console.log("res", res);
        window.location.assign("/terms-and-condition-list");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="mt-3 p-4 row"
      style={{ backgroundColor: "white", borderRadius: "8px" }}
    >
      <div className="col-md-7">
        <div className="mb-2">
          Select <span style={{ color: "red" }}>*</span>
        </div>
        <div>
          <select
            className="input-0-1-134 input-d21-0-1-1124 undefined"
            style={{ borderRadius: "7px" }}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <div className="mb-2 mt-2">Title</div>
        <div>
          <input
            className="input-0-1-134 input-d21-0-1-1124 undefined "
            type="text"
            style={{ borderRadius: "7px" }}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <dic className="row mb-2 mt-2 ">
          <div className="col-md-10">Description</div>
        </dic>
        <div>
          <textarea
            className="input-0-1-134 input-d21-0-1-1124 undefined "
            type="text"
            style={{ borderRadius: "7px" }}
            onChange={(e) => setParagraph(e.target.value)}
          />
        </div>

        <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
          <Button variant="primary" onClick={addTNC}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddTC;
