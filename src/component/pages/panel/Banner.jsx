import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
// import { FaEye } from "react-icons/fa";
// import { RxSlash } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { apiUrl } from "../../../api-services/apiContents";
import Loader from "../../loader/Loader";
import { useConfirm } from "../../common/ConfirmProvider";

function Banner() {
  const confirm = useConfirm();
  const [bannerImages, setBannerImages] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allBanners, setAllBanners] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_BANNERS}`);
      if (res.status === 200) {
        console.log("banners res", res.data.data);
        setAllBanners(res.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addBanner = async (e) => {
    e.preventDefault();
    if (!bannerImages || bannerImages.length === 0) {
      alert("No banner image available. Please add a banner image to proceed.");
      return;
    }

    // Validate if the selected file is an image
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const file = bannerImages[0]; // Since it's a single image
    if (!validImageTypes.includes(file.type)) {
      alert("Please upload an image file (jpeg, png, gif).");
      return;
    }

    const formData = new FormData();
    formData.append("banner_image", file);

    try {
      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_BANNERS}`,
        formData,
      );
      if (res.status === 200) {
        alert("Banner Added Successfully");
        console.log("POST Request Success:", res);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteBanners = async (ele) => {
    const ok = await confirm({
      title: "Delete Banner",
      message: "Are you sure you want to delete this banner? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_BANNER}${ele._id}`,
      );
      if (res.status === 200) {
        alert("Banner deleted!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(Error, "deleting banner");
    }
  };

  const columns = [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Image",
      selector: (row) => (
        <>
          <div
            style={{
              padding: "5px",
            }}
          >
            <img
              src={row.banner_image}
              alt=""
              style={{ width: "100%", height: "80px", borderRadius: "10px" }}
            />
          </div>
        </>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => deleteBanners(row)}
            title="Delete"
          >
            <MdDelete size={16} color="#E91E63" />
          </div>
        </>
      ),
    },
  ];

  {
    isLoading && <Loader />;
  }

  return (
    <div className="row mt-2">
      <div className="col-md-6">
        <div
          className="border-top-for-all-border"
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
          }}
        >
          <div className="p-2">
            <h3 style={styles.itemsHead}>Add Banner</h3>
            <div
              style={{
                borderBottom: "1px solid #f4f4f4",
              }}
            ></div>
            <div className="mb-3">
              <h6 className="mt-3" style={styles.header}>
                Banner Image : ( Recommended Size : 625 x 250 pixels in
                Dimension)
              </h6>
              <input
                type="file"
                max={1}
                accept="image/*" // Restrict to image formats only
                onChange={(e) => setBannerImages(e.target.files)}
              />
            </div>
            <div
              style={{
                borderBottom: "1px solid #f4f4f4",
              }}
            ></div>
            <div className="mt-3 mb-2">
              <button onClick={addBanner} style={styles.buttonForEveything}>
                {" "}
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div
          className="border-top-for-all-border"
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
          }}
        >
          <div className="p-2">
            <h3 style={styles.itemsHead}>Banner List</h3>
            <div
              style={{
                borderBottom: "1px solid #f4f4f4",
              }}
            ></div>
            <div>
              <DataTable columns={columns} data={allBanners} />
            </div>
          </div>
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
};
export default Banner;
