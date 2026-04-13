import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { apiUrl } from "../../../api-services/apiContents";
import { useLocation } from "react-router-dom";
import axios from "axios";

function EditFaq() {
  const location = useLocation();
  const faq = location.state.faq;
  console.log("faq", faq);

  const [answer, setAnswer] = useState(faq.answer || "");
  const [question, setQuestion] = useState(faq.question || "");

  const editFaq = async () => {
    try {
      const data = {
        answer: answer,
        question: question,
      };
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_FAQ}${faq._id}`,
        data,
      );
      if (res.status === 200) {
        alert("Added");
        console.log("res", res);
        window.location.assign("/faq-list");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="mt-3 p-4"
      style={{ backgroundColor: "white", borderRadius: "8px" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        Question <span style={{ color: "red" }}>*</span>{" "}
        <input
          className="input-0-1-134 input-d21-0-1-1124 undefined ms-3"
          type="text"
          style={{ borderRadius: "7px", width: "45%" }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        Answer <span style={{ color: "red" }}>*</span>{" "}
        <textarea
          className="input-0-1-134 input-d21-0-1-1124 undefined ms-4"
          type="text"
          style={{ borderRadius: "7px", width: "45%" }}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
        <Button variant="primary" onClick={editFaq}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditFaq;
