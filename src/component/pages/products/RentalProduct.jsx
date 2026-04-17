import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../../api-services/apiContents";
import Loader from "../../loader/Loader";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { Badge } from "react-bootstrap";
import { MdDelete, MdMotionPhotosOff } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { useConfirm } from "../../common/ConfirmProvider";

const normalize = (v) =>
  v === null || v === undefined ? "" : String(v).toLowerCase().trim();

function RentalProduct() {
  const confirm = useConfirm();
  const [allRentalProduct, setAllRentalProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusType, setStatusType] = useState("");
  const [categoryType, setCategoryType] = useState("Select");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 180);
    return () => clearTimeout(id);
  }, [search]);

  const categories = [
    {
      type: "Sound",
    },
    {
      type: "Lighting",
    },
    {
      type: "Video",
    },
    {
      type: "Fabrication",
    },
    {
      type: "Genset",
    },
    {
      type: "Shamiana",
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.ALL_PRODUCT}`,
      );
      if (productRes.status === 200) {
        // console.log("allRentalProduct", productRes.data);
        // const rentalProductRes = productRes.data?.filter(
        //   (item) => item.product_type === "rental"
        // );
        setAllRentalProduct(productRes.data);
        // setAllRentalProduct(rentalProductRes?.reverse());
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteProduct = async (id) => {
    const ok = await confirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_PRODUCT}${id}`,
      );
      if (res.status === 200) {
        alert("Product Deleted");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const navigateToDetailedPage = (row) => {
    Navigate("/product/product-details", {
      state: {
        prooduct: row,
      },
    });
  };

  const searchResults = useMemo(() => {
    if (!allRentalProduct.length) return [];
    const term = normalize(debouncedSearch);
    const catFilter = normalize(categoryType === "Select" ? "" : categoryType);
    const statusFilter = normalize(statusType);
    const terms = term.split(/\s+/).filter(Boolean);

    return allRentalProduct.filter((item) => {
      if (catFilter && normalize(item.product_category) !== catFilter) return false;
      if (statusFilter && normalize(item.approval_status) !== statusFilter) return false;
      if (!terms.length) return true;
      const haystack = [
        item.product_name,
        item.vendor_name,
        item.shop_name,
        item.product_category,
        item.product_type,
        item.approval_status,
      ]
        .map(normalize)
        .join(" ");
      return terms.every((t) => haystack.includes(t));
    });
  }, [allRentalProduct, debouncedSearch, statusType, categoryType]);

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.product_category,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => {
        const imageUrl =
          row.product_image && row.product_image.length > 0
            ? row.product_image[0]
            : "placeholder.jpg";

        return (
          <div style={{ padding: "5px" }}>
            <img src={imageUrl} alt="Product" style={{ width: "45px" }} />
          </div>
        );
      },
      sortable: false,
    },
    {
      name: "Price",
      selector: (row) => "₹" + row.product_price,
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
      sortable: true,
    },
    {
      name: "Shop/Business Name",
      selector: (row) => row.shop_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge
          className="ms-2"
          bg={
            row.approval_status === "Disapproved"
              ? "danger"
              : row.approval_status === "Approved"
                ? "success"
                : "warning"
          }
        >
          {row.approval_status}
        </Badge>
      ),
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
            onClick={() => navigateToDetailedPage(row)}
          >
            <FaEye size={16} color="white" />
          </div>
          <div
            style={{
              cursor: "pointer",
              backgroundColor: "#e91e63",
              padding: "7px 13px",
            }}
            title="Delete"
            onClick={() => deleteProduct(row._id)}
          >
            <MdDelete size={16} color="white" />
          </div>
          {/* <div
            style={{
              cursor: "pointer",
              backgroundColor: row.isActive ? "#198754" : "#ffc107",
              padding: "7px 13px",
            }}
            title={row.isActive ? "Active" : "Inactive"}
          >
            {row.isActive ? (
              <FaCheck size={16} color="white" />
            ) : (
              <MdMotionPhotosOff size={16} color="white" />
            )}
          </div> */}
        </div>
      ),
    },
  ];

  const downloadReport = () => {
    const dataToDownload = searchResults.map((item) => ({
      Product_Name: item.product_name,
      Vendor: item.vendor_name,
      Image: `${apiUrl.IMAGEURL}${item.product_image[0]}`,
      status: item.approval_status,
      Action: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "vendor");
    XLSX.writeFile(workbook, "Rental-Products-list.xlsx");
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      {isLoading && <Loader />}
      {!isLoading && (
        <div>
          <div className="row mt-2 mb-1 pt-3 ps-2">
            <div className="col-md-8">
              <input
                type="search"
                value={search}
                placeholder="Search product/vendor/shop"
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  fontSize: "14px",
                  padding: "7px",
                  border: "1px solid #ebedf2",
                  outline: 0,
                  width: "35%",
                  borderRadius: "7px",
                }}
              />
            </div>
            <div
              className="col-md-4 d-flex"
              style={{ justifyContent: "flex-end" }}
            >
              <select
                style={{
                  border: "1px solid #ebedf2",
                  padding: "2px 5px",
                  borderRadius: "5px",
                }}
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
              >
                <option value="Select">Select</option>
                {categories.map((ele, idx) => (
                  <option key={idx} value={ele.type}>
                    {ele.type}
                  </option>
                ))}
              </select>
              <select
                style={{
                  border: "1px solid #ebedf2",
                  padding: "2px 5px",
                  borderRadius: "5px",
                  marginLeft: 10,
                }}
                value={statusType}
                onChange={(e) => setStatusType(e.target.value)}
              >
                <option value="">Filter</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Disapproved">Disapproved</option>
              </select>
              <FaDownload
                onClick={downloadReport}
                className="ms-3 me-5"
                style={{ cursor: "pointer", marginTop: "10px" }}
                size={16}
                color="#2F4E9E"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={searchResults}
            pagination
            //   defaultSortFieldId={1}
          />
        </div>
      )}
    </div>
  );
}

export default RentalProduct;
