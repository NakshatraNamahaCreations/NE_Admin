import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { postData } from "../../../api-services/apiHelper";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { Button } from "react-bootstrap";

function ChipInput({ serviceId }) {
  const [text, setText] = useState("");
  const [chips, setChips] = useState([]);
  const [type, setType] = useState("");
  const [validationError, setValidationError] = useState("");

  function removeChip(chipToRemove) {
    // filtering out the chip that the user wants to remove
    const updatedChips = chips.filter(
      (chip) => chip.parameter !== chipToRemove.parameter,
    );
    setChips(updatedChips);
  }

  const generateUniqueId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // Handle adding chip with button
  function handleAddChip() {
    // Validate fields
    if (!text) {
      setValidationError("Please enter a text!");
      return;
    }
    // Check for duplicates
    if (chips.some((chip) => chip.parameter === text)) {
      setValidationError("Cannot add the same input more than once.");
      return;
    }
    // Add chip to array
    setChips((prevState) => [
      ...prevState,
      { parameter: text, field_type: type, unique_id: generateUniqueId() },
    ]);
    setText("");
    setType("");
    setValidationError("");
  }

  // Handle key press event (Enter key)
  //   working
  function handlePressEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChip();
    }
  }
  console.log("chips list", chips);

  const addRequirements = async () => {
    if (!serviceId || chips.length === 0) {
      alert("Please Select Service and Add Requirements");
    } else {
      try {
        const data = {
          requirement_fields: chips,
        };
        const res = await axios.put(
          `${apiUrl.BASEURL}${apiUrl.ADD_REQUIREMENTS}/${serviceId}`,
          data,
        );
        if (res.status === 200) {
          console.log("response from requiment", res.data);
          alert("Added");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <div className="row ms-1">
        <input
          className="col-md-4"
          type="text"
          id="tags"
          placeholder="Add your requirements"
          value={text}
          style={styles.inputContainer}
          onChange={(e) => setText(e.target.value)}
          //   onKeyPress={handlePressEnter} //working
        />
        {/* <select
          className="col-md-4 ms-3"
          style={{ fontSize: "14px" }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">---Select type---</option>
          <option value="Text">Text </option>
          <option value="Date"> Date</option>
          <option value="Timing"> Time</option>
        </select> */}

        <Button
          className="col-md-3 ms-3"
          style={{ width: "fit-content" }}
          onClick={handleAddChip}
        >
          <IoMdAdd color="white" />
        </Button>
      </div>
      <ul style={styles.chips}>
        {chips.map((chip) => (
          <li key={chip} style={styles.chip}>
            <span style={styles.chipSpan}>
              {chip.parameter}
              {/* ({chip.field_type}) */}
            </span>
            <TiDelete
              style={styles.svgIcon}
              onClick={() => removeChip(chip)}
              tabIndex="0"
            />
          </li>
        ))}
      </ul>

      {validationError && <p style={styles.errorMessage}>{validationError}</p>}
      {chips.length > 0 && (
        <button
          style={{
            backgroundColor: "#609ecc",
            border: "#7ac536",
            color: "white",
            borderRadius: "3px",
            fontSize: "14px",
            padding: "0.5rem",
          }}
          onClick={addRequirements}
        >
          Submit
        </button>
      )}
    </div>
  );
}
const styles = {
  inputContainer: {
    padding: "5px 10px",
    fontSize: "14px",
  },
  chips: {
    listStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: "10px",
  },
  chip: {
    backgroundColor: "#cfe1ff",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    marginRight: "1rem",
    marginBottom: "1rem",
  },
  chipSpan: {
    color: "#013380",
    fontSize: "14px",
  },
  errorMessage: {
    marginTop: "12px",
    color: "red",
  },
  svgIcon: {
    color: "#013380",
    fontSize: "1.4rem",
    cursor: "pointer",
  },
};
export default ChipInput;
