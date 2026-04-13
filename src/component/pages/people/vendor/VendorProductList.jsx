import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
// import { bannerData } from "../../../global-data/booking";
import { FaEye } from "react-icons/fa";
import { apiUrl } from "../../../../api-services/apiContents";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../../../../api-services/apiHelper";
import Loader from "../../../loader/Loader";
import { Badge } from "react-bootstrap";

function VendorProductList({ vendorID }) {
  // const location = useLocation();
  // const vendorID = location.state.vendorId;
  // const vendorName = location.state.vendorName;
  // console.log("vendor if", vendorID);
  const Navigate = useNavigate();
  const [vendorProduct, setVendorProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const data = await get(
          `${apiUrl.BASEURL}${apiUrl.GET_PRODUCT_BY_VENDOR}${vendorID}`,
        );
        setVendorProduct(data.products);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);
  // console.log("vendorProduct in vendor  product poage", vendorProduct);

  const navigateToDetailedPage = (row) => {
    Navigate("/product/product-details", {
      state: {
        prooduct: row,
      },
    });
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product_name,
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
        <>
          <div
            style={{
              display: "flex",
            }}
            onClick={() => navigateToDetailedPage(row)}
          >
            <div style={{ cursor: "pointer" }} title="View">
              <FaEye size={16} color="#E91E63" /> View
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <div>
      <lable style={{ color: "#333", fontSize: "17px", fontWeight: "600" }}>
        Product Listings
      </lable>
      <br />
      <br />
      {isLoading && <Loader />}
      {!isLoading && (
        <div style={{ border: "1px solid #0000001f" }}>
          <DataTable
            columns={columns}
            data={vendorProduct}
            pagination
            //   defaultSortFieldId={1}
          />
        </div>
      )}
    </div>
  );
}
const styles = {
  itemsHead: {
    color: "#ea5362",
    fontWeight: "500",
    fontSize: "14px",
    marginTop: "5px",
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
    backgroundColor: "#014c8d",
    border: "#014c8d",
    color: "white",
    borderRadius: "3px",
    fontSize: "14px",
    padding: "5px 10px",
  },
};
export default VendorProductList;
