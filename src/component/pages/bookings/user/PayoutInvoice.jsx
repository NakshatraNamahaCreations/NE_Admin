import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { toWords } from "number-to-words";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";
import Loader from "../../../loader/Loader";
import { IoMdArrowBack } from "react-icons/io";

function PayoutInvoice() {
  const location = useLocation();
  const product = location.state.product;
  const navigate = useNavigate();
  console.log("payout Invoice", product);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorData, setVendorData] = useState([]);
  const cgst = product.totalPrice * 0.09;
  const sgst = product.totalPrice * 0.09;
  const remainingAmount = product.totalPrice - cgst - sgst;
  // console.log("remainingAmount", remainingAmount);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const payoutRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${product?.seller_id}`,
        );
        if (payoutRes.status === 200) {
          setVendorData(payoutRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [product?.seller_id]);

  console.log("vendorData", vendorData);

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoiceContent");
    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("payout.pdf");
    });
  };

  return (
    <div className="mx-5">
      {isLoading && <Loader />}
      <IoMdArrowBack
        color="#4b4b4b"
        size={20}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
      <div
        id="invoiceContent"
        className="p-3 mt-3"
        style={{
          backgroundColor: "white",
          boxShadow: "rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        }}
      >
        <h5 className="text-3xl text-center font-bold">PAYOUT INVOICE</h5>
        <hr />
        <div style={{ display: "flex" }}>
          <div className="col-md-6">
            <h6>{product.seller_name}</h6>
            <div>
              {Array.isArray(vendorData?.address) && vendorData.address[0] && (
                <>
                  {vendorData.address[0].houseFlatBlock}{" "}
                  {vendorData.address[0].roadArea}{" "}
                  {vendorData.address[0].cityDownVillage}{" "}
                  {vendorData.address[0].distric} {vendorData.address[0].state}{" "}
                  - {vendorData.address[0].pincode}
                </>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }} className="col-md-6">
            <div>
              {" "}
              <b>VEN_NE_{product.payout_id?.slice(-4).toUpperCase()}</b>
            </div>
            <div>
              <b>Invoice Date: {moment().format("LL")} </b>{" "}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>Order Date</th>
                <th>Order ID</th>
                <th>Order Total (A)</th>
                <th>Commission (B) </th>
                <th style={{ textAlign: "center" }}>Tax (C) </th>
                <th>Payout Amount A-(B+C) </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{moment(product.ordered_date).format("LLL")}</td>
                <td style={{ textAlign: "center" }}>{product.order_id}</td>
                <td style={{ textAlign: "center" }}>
                  ₹{product.payment_amount?.toFixed(2)}{" "}
                </td>
                <td style={{ textAlign: "center" }}>
                  {product.commission_percentage?.toFixed(2)}% | ₹
                  {product.commission_amount?.toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {product.commission_tax?.toFixed(2)}% | ₹
                  {product.tax_amount?.toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  ₹{product.payout_amount?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
          <div style={{ textAlign: "right" }}>
            {" "}
            <b>Total: ₹{product.payout_amount?.toFixed(2)}</b>
          </div>
          <hr />
          <div style={{ textAlign: "right" }}>
            {" "}
            <b>
              {" "}
              {toWords(product.payout_amount)
                .replace(/,/g, "")
                .toUpperCase()}{" "}
              Only{" "}
            </b>
          </div>
          <hr />
          <div>
            <b>Remarks:</b> {product.remark}
          </div>
          <hr />
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: 20 }}>
        <button
          style={{
            color: "white",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#2F4E9E",
            padding: "3px 5px",
            borderRadius: "3px",
            border: 0,
          }}
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default PayoutInvoice;
