import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { get } from "../../../../api-services/apiHelper";
import Loader from "../../../loader/Loader";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Badge, Button, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useConfirm } from "../../../common/ConfirmProvider";

function UserList() {
  // const Navigate = useNavigate();
  const confirm = useConfirm();
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    // setIsLoading(true);
    try {
      const data = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_USERS_LIST}`);
      if (data.status === 200) {
        const resData = data.data;
        setUserList(resData.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // console.log("userList", userList);

  const showUserDetails = (row) => {
    setShowModal(true);
    setRowData(row);
  };

  const downloadData = () => {
    const dataToDownload = userList.map((item) => ({
      user_name: item.username,
      email: item.email,
      mobile_number: item.mobilenumber,
      company_name:
        item.company_profile.length > 0
          ? item.company_profile[0]?.company_name
          : "-",
      company_type:
        item.company_profile.length > 0
          ? item.company_profile[0]?.company_type
          : "-",
      pan_number:
        item.company_profile.length > 0
          ? item.company_profile[0]?.pan_number
          : "-",
      gst_number:
        item.company_profile.length > 0
          ? item.company_profile[0]?.gst_number
          : "-",
      cin_number:
        item.company_profile.length > 0
          ? item.company_profile[0]?.cin_number
          : "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "payment list");
    XLSX.writeFile(workbook, `User list.xlsx`);
  };

  const searchResults = userList.filter((user) => {
    if (search) {
      return user.username.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleDeleteUser = async (id) => {
    const ok = await confirm({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_USER}${id}`,
      );
      if (res.status === 200) {
        alert("User Deleted!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const columns = [
    // {
    //   name: "ID",
    //   selector: (row, index) => row._id,
    //   sortable: true,
    // },
    {
      name: "User Name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobilenumber,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) =>
        row.company_profile.length > 0
          ? row.company_profile[0]?.company_name
          : "-",
      sortable: true,
    },
    // {
    //   name: "Company Type",
    //   selector: (row) =>
    //     row.company_profile.length > 0
    //       ? row.company_profile[0]?.company_type
    //       : "-",
    //   sortable: true,
    // },
    // {
    //   name: "Designation",
    //   selector: (row) =>
    //     row.company_profile.length > 0
    //       ? row.company_profile[0]?.designation
    //       : "-",
    //   sortable: true,
    // },
    // {
    //   name: "GST",
    //   selector: (row) =>
    //     row.company_profile.length > 0
    //       ? row.company_profile[0]?.gst_number
    //       : "-",
    //   sortable: true,
    // },
    // {
    //   name: "PAN",
    //   selector: (row) =>
    //     row.company_profile.length > 0
    //       ? row.company_profile[0]?.pan_number
    //       : "-",
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) =>
        row.is_block ? (
          <Badge bg="warning">Unblock</Badge>
        ) : (
          <Badge bg="success">Block</Badge>
        ),

      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div style={{ display: "flex" }}>
          <div
            style={{
              cursor: "pointer",
              backgroundColor: "#2f4e9e",
              padding: "7px 13px",
            }}
            title="View"
            onClick={() => showUserDetails(row)}
          >
            <FaEye size={16} color="#ffffff" />
          </div>
          <div
            onClick={() => handleDeleteUser(row._id)}
            style={{
              cursor: "pointer",
              backgroundColor: "#e91e63",
              padding: "7px 13px",
              // borderLeftBottomRadius: "3px",
              // borderLeftTopRadius: "3px",
            }}
            title="Delete"
          >
            <MdDelete size={16} color="white" />
          </div>
          {/* <div
            style={{
              cursor: "pointer",
              backgroundColor: row.is_block ? "#ffa534" : "#35cd3a",
              padding: "7px 13px",
            }}
            title={row.is_block ? "User has been blocked" : "Block the user"}
          >
            {row.is_block ? (
              <CgUnblock size={16} color="white" />
            ) : (
              <MdBlock size={16} color="white" />
            )}
          </div> */}
        </div>
      ),
      // sortable: true,
    },
  ];
  console.log("userlist", userList);

  return (
    <div>
      <div className="headerTitle-0-1-70">User List({userList.length}) </div>
      {isLoading && <Loader />}
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <input
            type="search"
            value={search}
            placeholder="Search name"
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontSize: "14px",
              padding: "7px",
              border: "1px solid #ebedf2",
              outline: 0,
              borderRadius: "7px",
            }}
          />
        </div>
        <div
          className="ms-2 me-2"
          style={{
            backgroundColor: "#609ecc",
            padding: "5px",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={downloadData}
        >
          <FaDownload size={16} color="white" /> Download
        </div>
        <br /> <br />
      </div>{" "}
      <DataTable
        columns={columns}
        data={searchResults}
        pagination
        //   defaultSortFieldId={1}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {rowData && (
            <div className="row">
              <div className="col-md-6">
                <div>
                  <b>{rowData.username || "N/A"}</b>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Email:{" "}
                  </span>
                  <span>{rowData.email || "N/A"}</span>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Mobile Number:{" "}
                  </span>
                  <span>{rowData.mobilenumber || "N/A"}</span>
                </div>
                {/* <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Role:
                  </span>{" "}
                  <span>
                    {rowData.company_profile[0]?.designation || "N/A"}
                  </span>
                </div> */}
              </div>
              <div className="col-md-6">
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Company Type:
                  </span>{" "}
                  <span>
                    {rowData.company_profile[0]?.company_type || "N/A"}
                  </span>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Company Name:
                  </span>{" "}
                  <span>
                    {rowData.company_profile[0]?.company_name || "N/A"}
                  </span>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    GSTIN:
                  </span>{" "}
                  <span>{rowData.company_profile[0]?.gst_number || "NA"}</span>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    PAN Number:
                  </span>{" "}
                  <span>{rowData.company_profile[0]?.pan_number || "NA"}</span>
                </div>
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <span style={{ color: "black", fontWeight: "500" }}>
                    CIN Number:
                  </span>{" "}
                  <span>{rowData.company_profile[0]?.cin_number || "NA"}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          {rowData?.is_block ? (
            <Button variant="primary" onClick={() => setShowModal(false)}>
              <CgUnblock /> Unblock
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setShowModal(false)}>
              <MdBlock /> Block User
            </Button>
          )}
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default UserList;
