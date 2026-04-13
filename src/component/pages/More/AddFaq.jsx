import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { postData } from "../../../api-services/apiHelper";
import { apiUrl } from "../../../api-services/apiContents";

function AddFaq() {
  const [selectedType, setSelectedType] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  const addFAQ = async () => {
    if (!selectedType || !answer || !question) {
      alert("Answer's and Question's should not empty");
    } else {
      try {
        const data = {
          selected_type: selectedType,
          answer: answer,
          question: question,
        };
        const res = await postData(apiUrl.ADD_FAQ, data);
        if (res) {
          alert("Added");
          console.log("res", res);
          window.location.assign("/faq-list");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div
      className="mt-3 p-4 row"
      style={{ backgroundColor: "white", borderRadius: "8px" }}
    >
      {/* <div className="mt-3 row">
        Select <span style={{ color: "red" }}>*</span>{" "}
        <select className="input-0-1-134 input-d21-0-1-1124 undefined ms-3">
          <option value="">Select Type</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        Question <span style={{ color: "red" }}>*</span>{" "}
        <input
          className="input-0-1-134 input-d21-0-1-1124 undefined ms-3"
          type="text"
          style={{ borderRadius: "7px", width: "45%" }}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        Answer <span style={{ color: "red" }}>*</span>{" "}
        <textarea
          className="input-0-1-134 input-d21-0-1-1124 undefined ms-4"
          type="text"
          style={{ borderRadius: "7px", width: "45%" }}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        <Button variant="primary" onClick={addFAQ}>
          Save
        </Button>
      </div> */}
      <div className="col-md-4">
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
        <div className="mb-2 mt-2">
          Question <span style={{ color: "red" }}>*</span>
        </div>
        <div>
          <input
            className="input-0-1-134 input-d21-0-1-1124 undefined "
            type="text"
            style={{ borderRadius: "7px" }}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="mb-2 mt-2">
          Answer <span style={{ color: "red" }}>*</span>
        </div>
        <div>
          <textarea
            className="input-0-1-134 input-d21-0-1-1124 undefined "
            type="text"
            style={{ borderRadius: "7px" }}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
          <Button variant="primary" onClick={addFAQ}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddFaq;
