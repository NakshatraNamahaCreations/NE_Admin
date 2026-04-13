import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useState } from "react";
import "ckeditor5/ckeditor5.css";
// import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import {
  Bold,
  ClassicEditor,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from "ckeditor5";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";

function AboutUs() {
  // const [content, Content] = useState({});
  // const [content, Content] = useState({});
  const [vendorContent, setVendorContent] = useState("");

  const fetchData = async () => {
    try {
      const vendorRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_TNC}`
      );
      if (vendorRes.status === 200) {
        setVendorContent(vendorRes.data.termsContent || "");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveTnCVendor = async () => {
    try {
      const res = await axios.put(`${apiUrl.BASEURL}${apiUrl.SAVE_TNC}`, {
        termsContent: vendorContent,
      });
      if (res.status === 200) {
        console.log("log res", res.data.data.termsContent);
        setVendorContent(res.data.data.termsContent);
        alert("Terms and Conditions saved successfully");
        fetchData();
      }
    } catch (error) {
      console.log("Error saving terms:", error);
      alert("Failed to save Terms & Conditions");
    }
  };

  return (
    <div
      className="mt-3 row"
      style={{ backgroundColor: "white", padding: "20px" }}
    >
      {" "}
      <div className="col-md-6">
        <div>
          <b> About Us</b>
        </div>
        <br />
        <CKEditor
          editor={ClassicEditor}
          data={vendorContent}
          config={{
            toolbar: {
              items: ["undo", "redo", "|", "bold", "italic"],
            },
            plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setVendorContent(data);
          }}
        />
        <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
          <button onClick={saveTnCVendor} className="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
