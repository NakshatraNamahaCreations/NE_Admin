import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import {
  categorySound,
  categoryLightings,
  categoryVideo,
  categoryGenSet,
  categoryFabrication,
  categoryShamiana,
} from "../global-data/global-data";
import axios from "axios";
import { apiUrl } from "../api-services/apiContents";
import * as XLSX from "xlsx";

function Add_Product() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [mrpRate, setMrpRate] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [stockInHand, setStockInHand] = useState("");
  const [modelName, setModelName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [productDimension, setProductDimension] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [manufactureName, setManufactureName] = useState("");
  const [color, setColor] = useState("");
  const [file, setFile] = useState(null);
  const [warranty, setWarranty] = useState("");
  const categories = [
    { type: "Sound" },
    { type: "Lighting" },
    { type: "Video" },
    { type: "Fabrication" },
    { type: "Genset" },
    { type: "Shamiana" },
  ];

  const [addItems, setAddItems] = useState([
    { selectItem: "", ItemSpecification: "" },
  ]);

  const addSpecifications = () => {
    const newBoard = { selectItem: "", ItemSpecification: "" };
    setAddItems((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleSelectItemChange = (index, label) => {
    const updatedItems = [...addItems];
    updatedItems[index].selectItem = label;
    setAddItems(updatedItems);
  };

  const handleSpecificationChange = (index, value) => {
    const updatedItems = [...addItems];
    updatedItems[index].ItemSpecification = value;
    setAddItems(updatedItems);
  };

  const handleDocumentUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "image") {
      setGalleryImages(files);
    } else if (type === "video") {
      setGalleryVideos(files);
    }
  };
  console.log("galleryImages", galleryImages);

  const calculateDiscount =
    mrpRate && productPrice ? ((mrpRate - productPrice) / mrpRate) * 100 : 0;
  const discountValue = Math.round(calculateDiscount);

  const addProduct = async () => {
    // Basic validation to check if all required fields are filled
    if (
      !productName ||
      !productPrice ||
      !mrpRate ||
      !selectedCategory ||
      !productBrand ||
      !stockInHand ||
      !modelName ||
      !materialType ||
      !productDimension ||
      !productWeight ||
      !countryOfOrigin ||
      !manufactureName
      // galleryImages.length === 0 ||
      // !galleryVideos
    ) {
      alert("Error", "Please fill all mandatory fields and add images/videos");
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("vendor_id", "670622e9668b7b32798e6c96");
      formData.append("vendor_name", "Mani thiruvengadam");
      formData.append("product_type", "rental");
      formData.append("product_name", productName);
      formData.append("product_price", productPrice);
      formData.append("discount", discountValue);
      formData.append("mrp_rate", mrpRate);
      formData.append("product_category", selectedCategory);
      formData.append("brand", productBrand);
      formData.append("stock_in_hand", stockInHand);
      formData.append("model_name", modelName);
      formData.append("material_type", materialType);
      formData.append("product_dimension", productDimension);
      formData.append("product_weight", productWeight);
      formData.append("country_of_orgin", countryOfOrigin);
      formData.append("manufacturer_name", manufactureName);
      formData.append("product_color", color);
      formData.append("shop_name", "Mani Electricals");

      formData.append(
        "Specifications",
        JSON.stringify(
          addItems.map((item) => ({
            name: item.selectItem,
            value: item.ItemSpecification,
          })),
        ),
      );

      // Append images to FormData
      galleryImages.forEach((file, index) => {
        // formData.append("images", {
        formData.append("images", file, file.name);
        //   uri: uri.uri, // Ensure the image URI is properly formatted
        //   name: `image_${index}.jpg`,
        //   type: "image/jpeg",
        // });
      });

      // Append video to FormData
      if (galleryVideos.length > 0) {
        formData.append("video", galleryVideos[0], galleryVideos[0].name);
        // formData.append("video", {
        //   uri: galleryVideos[0].uri, // Ensure the video URI is properly formatted
        //   name: "video.mp4",
        //   type: "video/mp4",
        // });
      }

      // Axios configuration
      const config = {
        url: apiUrl.ADD_PRODUCT,
        method: "post",
        baseURL: apiUrl.BASEURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };

      // Make the API request
      const response = await axios(config);

      // Handle success
      if (response.status === 200) {
        alert(response.data.message);
        console.log("Response:", response.data);
        // Optionally navigate or reset the form
        window.location.reload();
      } else {
        alert("Error", "Error while adding product");
      }
    } catch (error) {
      // Improved error handling
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          alert(
            "Error",
            error.response.data.message || "Error while adding product",
          );
        } else if (error.request) {
          console.error("Request data:", error.request);
          alert("Error", "No response received from server");
        }
      } else {
        console.error("Unknown error:", error);
        alert("Error", "An unknown error occurred");
      }
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        shop_name: "",
        vendor_id: "",
        vendor_name: "",
        product_category: "",
        product_type: "",
        product_name: "",
        product_price: "",
        mrp_rate: "",
        discount: "",
        brand: "",
        stock_in_hand: "",
        model_name: "",
        material_type: "",
        product_dimension: "",
        product_weight: "",
        country_of_orgin: "",
        warranty: "",
        manufacturer_name: "",
        product_color: "",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Name");
    XLSX.writeFile(workbook, "product-template.xlsx");
  };

  const uploadFile = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const addExcel = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Raw Excel Data:", jsonData);

        // Map the data to include only required fields
        const mappedData = jsonData.map((item) => ({
          service_name: item["service_name"],
          shop_name: item["shop_name"],
          vendor_id: item["vendor_id"],
          vendor_name: item["vendor_name"],
          product_category: item["product_category"],
          product_type: item["product_type"],
          product_name: item["product_name"],
          product_price: item["product_price"],
          mrp_rate: item["mrp_rate"],
          discount: item["discount"],
          brand: item["brand"],
          stock_in_hand: item["stock_in_hand"],
          model_name: item["model_name"],
          material_type: item["material_type"],
          product_dimension: item["product_dimension"],
          product_weight: item["product_weight"],
          country_of_orgin: item["country_of_orgin"],
          warranty: item["warranty"],
          manufacturer_name: item["manufacturer_name"],
          product_color: item["product_color"],
          // Ensure approval_status is added here in case backend requires it
          // approval_status: false,
        }));

        console.log("Mapped Data:", mappedData);

        // Send data to backend
        const response = await axios.post(
          `${apiUrl.BASEURL}${apiUrl.ADD_PRODUCTS_VIA_EXCEL}`,
          mappedData,
        );

        if (response.status === 200) {
          alert("Products Added Successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
        alert("Failed to add products. Please try again.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // const addExcel = async () => {
  //   if (file === "") {
  //     alert("Please select a file");
  //   } else {
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const data = new Uint8Array(e.target.result);
  //         const workbook = XLSX.read(data, { type: "array" });
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //         console.log("Raw Excel Data:", jsonData);

  //         const jsonData1 = jsonData.map((item) => ({
  //           service_name: item["service_name"],
  //           shop_name: item["shop_name"],
  //           vendor_id: item["vendor_id"],
  //           vendor_name: item["vendor_name"],
  //           product_category: item["product_category"],
  //           product_type: item["product_type"],
  //           product_name: item["product_name"],
  //           product_price: item["product_price"],
  //           mrp_rate: item["mrp_rate"],
  //           discount: item["discount"],
  //           brand: item["brand"],
  //           stock_in_hand: item["stock_in_hand"],
  //           model_name: item["model_name"],
  //           material_type: item["material_type"],
  //           product_dimension: item["product_dimension"],
  //           product_weight: item["product_weight"],
  //           country_of_orgin: item["country_of_orgin"],
  //           warranty: item["warranty"],
  //           manufacturer_name: item["manufacturer_name"],
  //           product_color: item["product_color"],
  //         }));

  //         // console.log("Mapped Data:", jsonData1);

  //         try {
  //           const addProduct = axios.post(
  //             `${apiUrl.BASEURL}${apiUrl.ADD_PRODUCTS_VIA_EXCEL}`,
  //             jsonData1
  //           );
  //           if (addProduct.status === 200) {
  //             // console.log("addProduct", addProduct);
  //             alert("Products Added!!!");
  //             window.location.reload();
  //           }
  //         } catch (error) {
  //           console.error("Error sending data to backend:", error);
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } else {
  //       alert("Please upload a file first.");
  //     }
  //   }
  // };

  return (
    <div className="row">
      <div className="col-md-6">
        <b> Add Product</b>
        <br />
        Product Image(s){" "}
        <input
          className="mb-1"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          id="icon-button-file"
          type="file"
          multiple
          onChange={(e) => handleDocumentUpload(e, "image")}
        />{" "}
        <br />
        Product Video(s){" "}
        <input
          className="mb-1"
          accept="video/mp4,video/mkv,video/x-m4v,video/*"
          id="icon-button-file"
          type="file"
          multiple
          onChange={(e) => handleDocumentUpload(e, "video")}
        />
        <br />
        Select Category{" "}
        <select
          className="mb-1"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select</option>
          {categories.map((ele) => (
            <option key={ele.type} value={ele.type}>
              {ele.type}
            </option>
          ))}
        </select>
        <br />
        <input
          className="mb-1"
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="number"
          placeholder="Price"
          min={1}
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="number"
          placeholder="MRP Rate"
          value={mrpRate}
          min={1}
          onChange={(e) => setMrpRate(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          placeholder="Discount"
          value={productPrice && mrpRate ? discountValue : 0}
          disabled
          onChange={(e) => setProductDiscount(e.target.value)}
        />
        <input
          className="mb-1"
          type="text"
          placeholder="Brand"
          value={productBrand}
          onChange={(e) => setProductBrand(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="number"
          placeholder="Quantity"
          value={stockInHand}
          onChange={(e) => setStockInHand(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Model Name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Material Type"
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Product dimensions"
          value={productDimension}
          onChange={(e) => setProductDimension(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Product Weight"
          value={productWeight}
          onChange={(e) => setProductWeight(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Country of Origin"
          value={countryOfOrigin}
          onChange={(e) => setCountryOfOrigin(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Manufacturer"
          value={manufactureName}
          onChange={(e) => setManufactureName(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />{" "}
        <input
          className="mb-1"
          type="text"
          placeholder="Warranty"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />{" "}
        <br />
        <br />
        Add Specifications <Button onClick={addSpecifications}>+</Button>
        <br />
        <br />
        {selectedCategory === "Sound" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categorySound.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.4, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Wired or wireless"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === "Lighting" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryLightings.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.6, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. RGB or single color"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === "Video" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryVideo.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.6, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 4K or 1080p"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === "Genset" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryGenSet.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.6, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Power output in kW"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === "Fabrication" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryFabrication.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.6, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Power output in kW"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === "Shamiana" ? (
          <>
            {addItems.map((ele, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <div style={{ flex: 0.6, marginRight: "2px" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {ele.selectItem || "Select a feature"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryShamiana.map((item) => (
                        <Dropdown.Item
                          key={item.value}
                          onClick={() =>
                            handleSelectItemChange(index, item.label)
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div style={{ flex: 0.6, marginLeft: "2px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Power output in kW"
                    value={ele.ItemSpecification}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : null}
        <br />
        <Button onClick={addProduct}>Add Product</Button>
      </div>
      <div className="col-md-6">
        <button
          className="me-2"
          onClick={downloadExcel}
          style={{
            backgroundColor: "#609ecc",
            border: "#7ac536",
            color: "white",
            borderRadius: "3px",
            fontSize: "14px",
            padding: "5px 10px",
          }}
        >
          Download excel
        </button>
        <input type="file" placeholder="Upload file" onChange={uploadFile} />
        <button
          onClick={addExcel}
          style={{
            backgroundColor: "#609ecc",
            border: "#7ac536",
            color: "white",
            borderRadius: "3px",
            fontSize: "14px",
            padding: "5px 10px",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Add_Product;
