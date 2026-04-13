import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaYoutube } from "react-icons/fa";
import { MdDelete, MdBlock } from "react-icons/md";
import Loader from "../../loader/Loader";
import axios from "axios";
import { apiUrl } from "../../../api-services/apiContents";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { postData } from "../../../api-services/apiHelper";

function Youtube() {
  const Navigate = useNavigate();
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkUrl, setLinkUrl] = useState("");
  const [question, setQuestion] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_YOUTUBE_LINK}`,
      );
      if (res.status === 200) {
        setVideoList(res.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addUrl = async () => {
    if (!linkUrl) {
      alert("Url should not empty");
    } else {
      try {
        const data = {
          video_link: linkUrl,
        };
        const res = await postData(apiUrl.ADD_YOUTUBE_LINK, data);
        if (res) {
          alert("Added");
          console.log("res", res);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  console.log("videoList", videoList);

  const editFaq = (row) => {
    Navigate("/edit-faq", {
      state: {
        faq: row,
      },
    });
  };

  const deleteLink = async (ele) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_YOUTUBE_LINK}${ele}`,
      );
      if (res.status === 200) {
        alert(res.data.success || "Link Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(Error, "Something went wrong! Try again");
    }
  };

  const activeStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.YOUTUBE_LINK_ACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchData();
        alert(res.data.message || "Status updated!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const inActiveStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.YOUTUBE_LINK_INACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchData();
        alert(res.data.message || "Status updated!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns = [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Video",
      selector: (row) => (
        <a
          href={`${row.video_link}`}
          target="_blank"
          title="View"
          style={{
            backgroundColor: "#36a3f7",
            padding: "7px 13px",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          <FaYoutube size={16} color="white" />
        </a>
      ),
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
              // onClick={() => editTeam(row._id)}
              title="Edit"
            >
              <MdEdit size={16} color="white" />
            </div> */}
            <div
              style={{
                backgroundColor: row.isVideoActive ? "#35cd3a" : "#2f4e9e",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              title={row.isVideoActive ? "Active" : "Inactive"}
            >
              {row.isVideoActive ? (
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
              onClick={() => deleteLink(row._id)}
              title="Delete"
            >
              <MdDelete size={16} color="white" />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {isLoading && <Loader />}

      <div className="row">
        <div className="col-md-5">
          <div
            className="border-top-for-all-border p-2"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <h6 className="mt-3" style={styles.header}>
              Youtube Url<span style={{ color: "red" }}> *</span>
            </h6>

            <input
              type="text"
              onChange={(e) => setLinkUrl(e.target.value)}
              style={styles.borderItems}
            />
            <div className="mt-3 mb-2">
              <button onClick={addUrl} style={styles.buttonForEveything}>
                Add Url
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div
            className="border-top-for-all-border"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <DataTable columns={columns} data={videoList} pagination />
          </div>
        </div>
      </div>
    </>
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
    border: "1px solid #c1c1c1",
    padding: "4px",
    width: "100%",
    borderRadius: "5px",
  },
};

export default Youtube;
