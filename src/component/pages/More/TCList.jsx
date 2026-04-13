import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import DataTable from "react-data-table-component";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MdEdit } from "react-icons/md";
import { MdDelete, MdBlock } from "react-icons/md";
import { Offcanvas, Table } from "react-bootstrap";
import EditTNC from "./EditTNC";

function TCList() {
  // const [content, Content] = useState({});
  const [vendorContent, setVendorContent] = useState([]);
  const [userContent, setUserContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVendorPage, setCurrentVendorPage] = useState(1);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [editContent, setEditContent] = useState({});

  const rowsPerPage = 10;
  const vendorRowsPerPage = 10;

  // ✅ Calculate total pages
  const totalPages = Math.ceil(userContent.length / rowsPerPage);
  const totalVendorPages = Math.ceil(vendorContent.length / vendorRowsPerPage);

  // ✅ Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // ✅ Get current vendor rows
  const indexOfLastRowVendor = currentVendorPage * vendorRowsPerPage;
  const indexOfFirstRowVendor = indexOfLastRowVendor - vendorRowsPerPage;

  const currentUserRows = userContent?.slice(indexOfFirstRow, indexOfLastRow);
  const currentVendorRows = vendorContent?.slice(
    indexOfFirstRowVendor,
    indexOfLastRowVendor,
  );

  // ✅ Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateVendor = (pageNumber) => setCurrentVendorPage(pageNumber);

  const fetchVendorData = async () => {
    try {
      const vendorRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_TNC}`,
      );
      if (vendorRes.status === 200) {
        setVendorContent(vendorRes.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USER_TNC}`,
      );
      if (userRes.status === 200) {
        console.log("userRes", userRes);
        setUserContent(userRes.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const deleteData = async (ele) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_TNC}${ele._id}`,
      );
      if (res.status === 200) {
        // console.log("deletevres", res);
        alert(res.data.success || "Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(Error, "Something went wrong! Try again");
    }
  };

  const handleEditContent = (content) => {
    setEditContent(content);
    setOpenPopUp(true);
  };

  // function stripHtml(html) {
  //   return html
  //     .replace(/<p>/g, "\n") // Convert <p> tags to newlines
  //     .replace(/<\/p>/g, "") // Remove closing </p> tags
  //     .replace(/<br\s*\/?>/g, "\n") // Convert <br> tags to newlines
  //     .replace(/&nbsp;/g, " ") // Replace &nbsp; with a space
  //     .replace(/<[^>]*>/g, "")
  //     .replace(/<(?!\/?(strong|em|b|i)\b)[^>]*>/g, "") // Remove remaining HTML tags
  //     .replace(/\n/g, "<br>");
  // }

  // const plainTextContent = stripHtml(userContent);

  // console.log(plainTextContent);
  // console.log("content", userContent);

  // const saveTnCVendor = async () => {
  //   try {
  //     const res = await axios.put(`${apiUrl.BASEURL}${apiUrl.SAVE_TNC}`, {
  //       termsContent: vendorContent,
  //     });
  //     if (res.status === 200) {
  //       console.log("log res", res.data.data.termsContent);
  //       setVendorContent(res.data.data.termsContent);
  //       alert("Terms and Conditions saved successfully");
  //       fetchData();
  //     }
  //   } catch (error) {
  //     console.log("Error saving terms:", error);
  //     alert("Failed to save Terms & Conditions");
  //   }
  // };
  // const saveTnCUser = async () => {
  //   try {
  //     const res = await axios.put(`${apiUrl.BASEURL}${apiUrl.SAVE_USER_TNC}`, {
  //       termsContent: userContent,
  //     });
  //     if (res.status === 200) {
  //       console.log("log res", res.data.data.termsContent);
  //       setUserContent(res.data.data.termsContent);
  //       alert("Terms and Conditions saved successfully");
  //       fetchData();
  //     }
  //   } catch (error) {
  //     console.log("Error saving terms:", error);
  //     alert("Failed to save Terms & Conditions");
  //   }
  // };

  return (
    <>
      <div
        onClick={() => window.location.assign("/add-terms&condition")}
        style={{
          backgroundColor: "blue",
          color: "white",
          borderRadius: 5,
          padding: "5px 10px",
          width: 50,
          marginTop: 20,
          cursor: "pointer",
        }}
      >
        Add
      </div>
      <div className="mt-3 row">
        <div className="col-md-6">
          <b>Terms & Conditions - Vendor</b>
          <br />
          <br />
          {vendorContent?.length > 0 && (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>SL.No</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVendorRows.map((ele, idx) => (
                    <tr key={idx} tyle={{ height: "60px" }}>
                      <td>{indexOfFirstRow + idx + 1}</td>
                      <td>{ele.title}</td>
                      <td>
                        {ele.description?.length > 150
                          ? ele.description?.substring(0, 150) + "..."
                          : ele.description}
                      </td>
                      <td>
                        <div style={{ display: "flex" }}>
                          <div
                            style={{
                              backgroundColor: "#ffa534",
                              padding: "7px 13px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditContent(ele)}
                            title="Edit"
                          >
                            <MdEdit size={16} color="white" />
                          </div>

                          <div
                            style={{
                              backgroundColor: "#E91E63",
                              padding: "7px 13px",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteData(ele)}
                            title="Delete"
                          >
                            <MdDelete size={16} color="white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {[...Array(totalVendorPages).keys()].map((number) => (
                  <button
                    key={number}
                    onClick={() => paginateVendor(number + 1)}
                    style={{
                      padding: "6px 12px",
                      margin: "0 4px",
                      backgroundColor:
                        currentVendorPage === number + 1
                          ? "#007bff"
                          : "#f0f0f0",
                      color: currentVendorPage === number + 1 ? "#fff" : "#000",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            </>
          )}
          {/* <DataTable columns={columns} data={vendorContent} pagination /> */}
          {/* <CKEditor
          key={"new-blog-editor"}
          editor={ClassicEditor}
          data={vendorContent}
          onChange={(event, editor) => {
            const data = editor.getData();
            setVendorContent(data);
          }}        
        /> */}
        </div>
        <div className="col-md-6">
          <b>Terms & Conditions - User</b>
          <br />
          <br />
          {userContent?.length > 0 && (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>SL.No</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUserRows.map((ele, idx) => (
                    <tr key={idx} tyle={{ height: "60px" }}>
                      <td>{indexOfFirstRow + idx + 1}</td>
                      <td>{ele.title}</td>
                      <td>
                        {ele.description?.length > 150
                          ? ele.description?.substring(0, 150) + "..."
                          : ele.description}
                      </td>
                      <td>
                        <div style={{ display: "flex" }}>
                          <div
                            style={{
                              backgroundColor: "#ffa534",
                              padding: "7px 13px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditContent(ele)}
                            title="Edit"
                          >
                            <MdEdit size={16} color="white" />
                          </div>

                          <div
                            style={{
                              backgroundColor: "#E91E63",
                              padding: "7px 13px",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteData(ele)}
                            title="Delete"
                          >
                            <MdDelete size={16} color="white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number + 1)}
                    style={{
                      padding: "6px 12px",
                      margin: "0 4px",
                      backgroundColor:
                        currentPage === number + 1 ? "#007bff" : "#f0f0f0",
                      color: currentPage === number + 1 ? "#fff" : "#000",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            </>
          )}
          {/* <DataTable columns={columns} data={userContent} pagination /> */}
          {/* <CKEditor
          key={"new-blog-editor"}
          editor={ClassicEditor}
          data={userContent}
          onChange={(event, editor) => {
            const data = editor.getData();
            setUserContent(data);
          }}
          onReady={(editor) => {
            editor.editing.view.change((writer) => {
              writer.setStyle(
                "min-height",
                "300px",
                editor.editing.view.document.getRoot()
              );
            });
          }}
        /> */}
        </div>
      </div>
      <Offcanvas
        show={openPopUp}
        placement="end"
        onHide={() => setOpenPopUp(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <>
            <EditTNC
              editContent={editContent}
              userData={fetchUserData}
              vendorData={fetchVendorData}
              setVisisbility={setOpenPopUp}
            />
          </>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default TCList;
