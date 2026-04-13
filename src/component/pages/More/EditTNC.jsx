import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";

function EditTNC({ editContent, userData, vendorData, setVisisbility }) {
  console.log("editContent", editContent);

  const [title, setTitle] = useState(editContent.title || "");
  const [description, setDescription] = useState(editContent.description || "");

  const editFaq = async () => {
    try {
      const data = {
        title: title,
        description: description,
      };
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_TNC}${editContent._id}`,
        data,
      );
      if (res.status === 200) {
        alert("Updated");
        userData();
        vendorData();
        setVisisbility(false);
        console.log("res", res);
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
      <div>Title</div>
      <input
        className="input-0-1-134 input-d21-0-1-1124 undefined "
        type="text"
        style={{ borderRadius: "7px" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="mt-3">Description</div>
      <textarea
        className="input-0-1-134 input-d21-0-1-1124 undefined"
        type="text"
        style={{ borderRadius: "7px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mt-3">
        <Button variant="primary" onClick={editFaq}>
          Update
        </Button>
      </div>
    </div>
  );
}

export default EditTNC;
