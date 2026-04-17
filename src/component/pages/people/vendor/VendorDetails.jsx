import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Modal,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  IoMdArrowBack,
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import {
  MdOutlinePerson,
  MdOutlineBusinessCenter,
  MdOutlineAccountBalance,
  MdOutlineDescription,
  MdOutlineLocationOn,
  MdOutlineVerifiedUser,
  MdOutlineEdit,
  MdOutlineSave,
  MdOutlineImageNotSupported,
} from "react-icons/md";
import { apiUrl } from "../../../../api-services/apiContents";
import { useConfirm } from "../../../common/ConfirmProvider";
import VendorProductList from "./VendorProductList";
import VendorServiceList from "./VendorServiceList";

const STATUS_STYLES = {
  Approved: { bg: "#e6f7ee", fg: "#198754", border: "#198754" },
  Disapproved: { bg: "#fdecee", fg: "#dc3545", border: "#dc3545" },
  "Under Review": { bg: "#b98900", fg: "#ffc107", border: "#ffc107" },
};

const SectionCard = memo(function SectionCard({
  icon,
  title,
  action,
  children,
}) {
  return (
    <Card className="shadow-sm border-0 mb-3" style={styles.card}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <span style={styles.sectionIcon}>{icon}</span>
            <h6 className="mb-0 ms-2" style={styles.sectionTitle}>
              {title}
            </h6>
          </div>
          {action}
        </div>
        {children}
      </Card.Body>
    </Card>
  );
});

const InfoField = memo(function InfoField({ label, value, fallback = "NA" }) {
  const display =
    value === null || value === undefined || value === "" ? fallback : value;
  return (
    <div className="mb-3">
      <div style={styles.fieldLabel}>{label}</div>
      <div
        style={styles.fieldValue}
        title={typeof display === "string" ? display : ""}
      >
        {display}
      </div>
    </div>
  );
});

const LazyImage = memo(function LazyImage({ src, alt, height = 140 }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div style={{ ...styles.imageBox, height }}>
        <MdOutlineImageNotSupported size={28} color="#b8becb" />
        <span style={styles.imageEmpty}>No image</span>
      </div>
    );
  }
  return (
    <a href={src} target="_blank" rel="noreferrer" style={styles.imageLink}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ ...styles.image, height }}
      />
    </a>
  );
});

const SkeletonBlock = ({ height = 16, width = "100%", className = "" }) => (
  <div
    className={`skeleton-shimmer ${className}`}
    style={{ height, width, borderRadius: 6 }}
  />
);

const VendorDetailsSkeleton = () => (
  <div style={styles.page}>
    <style>{shimmerCSS}</style>
    <SkeletonBlock height={28} width={220} className="mb-3" />
    <Card className="shadow-sm border-0 mb-3">
      <Card.Body className="p-4">
        <Row>
          <Col md={2}>
            <SkeletonBlock height={110} width={110} />
          </Col>
          <Col md={10}>
            <SkeletonBlock height={20} width="40%" className="mb-2" />
            <SkeletonBlock height={14} width="60%" className="mb-2" />
            <SkeletonBlock height={14} width="30%" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
    {[1, 2, 3].map((i) => (
      <Card key={i} className="shadow-sm border-0 mb-3">
        <Card.Body className="p-4">
          <SkeletonBlock height={18} width="25%" className="mb-3" />
          <Row>
            {[1, 2, 3, 4].map((c) => (
              <Col md={3} key={c}>
                <SkeletonBlock height={12} width="60%" className="mb-2" />
                <SkeletonBlock height={16} width="90%" className="mb-3" />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    ))}
  </div>
);

function VendorDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const vendor = location.state?.vendor;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [bankEditing, setBankEditing] = useState(false);
  const [bankEdit, setBankEdit] = useState({
    ifscCode: "",
    branchName: "",
    accountHolder: "",
    accountNumber: "",
    bankName: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (vendor) {
      setBankEdit({
        bankName: vendor.bank_name || "",
        accountHolder: vendor.account_holder_name || "",
        accountNumber: vendor.account_number || "",
        ifscCode: vendor.ifsc_code || "",
        branchName: vendor.bank_branch_name || "",
      });
    }
  }, [vendor]);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
  }, []);

  const hideToast = useCallback(
    () => setToast((t) => ({ ...t, show: false })),
    [],
  );

  const handleBankEdit = useCallback((e) => {
    const { name, value } = e.target;
    setBankEdit((prev) => ({ ...prev, [name]: value }));
  }, []);

  const goBack = useCallback(() => {
    navigate("/vendor-list");
  }, [navigate]);

  const refreshVendorList = useCallback(() => {
    setTimeout(() => {
      window.location.assign("/vendor-list");
    }, 900);
  }, []);

  const makeVendorApproval = useCallback(async () => {
    const ok = await confirm({
      title: "Approve Vendor",
      message: "Are you sure you want to approve this vendor?",
      confirmText: "Yes, Approve",
      cancelText: "No",
      variant: "success",
    });
    if (!ok) return;
    try {
      setActionLoading("approve");
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.VENDOR_APPROVE}${vendor._id}`,
      );
      if (res.status === 200) {
        showToast("Vendor approved successfully", "success");
        refreshVendorList();
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to approve vendor",
        "danger",
      );
    } finally {
      setActionLoading(null);
    }
  }, [vendor, showToast, refreshVendorList, confirm]);

  const makeVendorDisapproval = useCallback(async () => {
    if (!reason.trim()) {
      setReasonError("Please provide a reason for disapproval.");
      return;
    }
    try {
      setActionLoading("disapprove");
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.VENDOR_DISAPPROVE}${vendor._id}`,
        { reason_for_disapprove: reason.trim() },
      );
      if (res.status === 200) {
        showToast("Vendor disapproved successfully", "success");
        setShowDisapproveModal(false);
        refreshVendorList();
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to disapprove vendor",
        "danger",
      );
    } finally {
      setActionLoading(null);
    }
  }, [reason, vendor, showToast, refreshVendorList]);

  const toggleServiceStatus = useCallback(async () => {
    const next = !vendor.isActive;
    const ok = await confirm({
      title: `${next ? "Activate" : "Deactivate"} Vendor`,
      message: `Are you sure you want to change the status to ${next ? "Active" : "Inactive"}?`,
      confirmText: "Yes",
      cancelText: "No",
      variant: next ? "success" : "warning",
    });
    if (!ok) return;
    try {
      setActionLoading("status");
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_VENDOR_STATUS}${vendor._id}`,
        { isActive: next },
      );
      if (res.status === 200) {
        showToast(`Vendor ${next ? "activated" : "deactivated"}`, "success");
        refreshVendorList();
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to update status",
        "danger",
      );
    } finally {
      setActionLoading(null);
    }
  }, [vendor, showToast, refreshVendorList, confirm]);

  const editBankDetails = useCallback(async () => {
    if (!vendor.is_approved) {
      showToast(
        "Vendor is not approved yet. Approve before editing bank details.",
        "warning",
      );
      return;
    }
    const { bankName, accountHolder, accountNumber, ifscCode, branchName } =
      bankEdit;
    if (
      !bankName ||
      !accountHolder ||
      !accountNumber ||
      !ifscCode ||
      !branchName
    ) {
      showToast("Please fill all bank details", "warning");
      return;
    }
    try {
      setActionLoading("bank");
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.EDIT_BANK_DETAILS}${vendor._id}`,
        {
          bank_name: bankName,
          account_holder_name: accountHolder,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_branch_name: branchName,
        },
      );
      if (res.status === 200) {
        showToast("Bank details updated successfully", "success");
        setBankEditing(false);
        refreshVendorList();
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to update bank details",
        "danger",
      );
    } finally {
      setActionLoading(null);
    }
  }, [vendor, bankEdit, showToast, refreshVendorList]);

  const openDisapproveModal = useCallback(() => {
    setReason("");
    setReasonError("");
    setShowDisapproveModal(true);
  }, []);

  const addr = vendor?.address?.[0];
  const formattedAddress = useMemo(() => {
    if (!addr) return null;
    return [
      addr.houseFlatBlock,
      addr.roadArea,
      addr.cityDownVillage,
      addr.distric,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }, [addr]);

  const statusTheme =
    STATUS_STYLES[vendor?.review_status] || STATUS_STYLES["Under Review"];

  if (!vendor) {
    return (
      <div style={styles.page}>
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center p-5">
            <IoMdCloseCircleOutline size={48} color="#dc3545" />
            <h5 className="mt-3">Vendor data not available</h5>
            <p className="text-muted">
              Please go back to the vendor list and try again.
            </p>
            <Button variant="primary" onClick={goBack}>
              Back to Vendor List
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (loading) return <VendorDetailsSkeleton />;

  return (
    <div style={styles.page}>
      <style>{shimmerCSS}</style>

      {/* Breadcrumb */}
      <div className="d-flex align-items-center mb-3" style={{ fontSize: 14 }}>
        <button
          type="button"
          onClick={goBack}
          style={styles.backButton}
          aria-label="Back to vendor list"
        >
          <IoMdArrowBack color="#4b4b4b" size={18} />
        </button>
        <span style={{ color: "#7d8592", marginLeft: 8 }}>Vendors</span>
        <span style={{ color: "#c4c9d4", margin: "0 8px" }}>/</span>
        <span style={{ color: "#25282b", fontWeight: 600 }}>
          Vendor Details
        </span>
      </div>

      {/* Header / Hero */}
      <Card className="shadow-sm border-0 mb-3" style={styles.card}>
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8} xs={12}>
              <div className="d-flex align-items-center flex-wrap">
                <div style={styles.avatarWrap}>
                  <LazyImage
                    src={vendor.shop_image_or_logo}
                    alt={vendor.shop_name}
                    height={96}
                  />
                </div>
                <div className="ms-3">
                  <h4 className="mb-1" style={styles.heroTitle}>
                    {vendor.shop_name || vendor.vendor_name || "Vendor"}
                  </h4>
                  <div style={styles.heroSub}>
                    <MdOutlinePerson size={14} /> {vendor.vendor_name || "—"}
                    <span className="mx-2" style={{ color: "#dde1e6" }}>
                      |
                    </span>
                    {vendor.email || "—"}
                    <span className="mx-2" style={{ color: "#dde1e6" }}>
                      |
                    </span>
                    {vendor.mobile_number || "—"}
                    <span className="mx-2" style={{ color: "#dde1e6" }}>
                      |
                    </span>
                    Registered On: {vendor.createdAt?.substring(0, 10) || "—"}
                  </div>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    <Badge
                      bg={statusTheme.bg}
                      style={{
                        ...styles.statusPill,
                        color: statusTheme.fg,
                        border: `1px solid ${statusTheme.border}`,
                      }}
                    >
                      {vendor.review_status || "Unknown"}
                    </Badge>
                    {vendor.profession && (
                      <Badge style={styles.professionPill}>
                        {vendor.profession}
                      </Badge>
                    )}
                    {/* {typeof vendor.isActive === "boolean" &&
                      vendor.is_approved && (
                        <Badge
                          style={{
                            ...styles.statusPill,
                            background: vendor.isActive ? "#e6f7ee" : "#f1f3f5",
                            color: vendor.isActive ? "#198754" : "#6c757d",
                            border: `1px solid ${vendor.isActive ? "#b6e4cc" : "#dee2e6"}`,
                          }}
                        >
                          {vendor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )} */}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4} xs={12} className="text-md-end mt-3 mt-md-0">
              <button
                type="button"
                onClick={() => setShowProductList((s) => !s)}
                style={styles.linkButton}
              >
                {showProductList
                  ? "← Back to Details"
                  : vendor.profession === "Vendor & Seller"
                    ? "View Product Listing"
                    : "View Service Listing"}
              </button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {showProductList ? (
        <Card className="shadow-sm border-0" style={styles.card}>
          <Card.Body className="p-3">
            {vendor.profession === "Vendor & Seller" ? (
              <VendorProductList
                vendorID={vendor._id}
                vendorName={vendor.vendor_name}
              />
            ) : (
              <VendorServiceList
                vendorID={vendor._id}
                vendorName={vendor.vendor_name}
              />
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Basic Information */}
          <SectionCard
            icon={<MdOutlinePerson size={20} color="#00968b" />}
            title="Basic Information"
          >
            <Row>
              <Col md={3} sm={6}>
                <InfoField label="Vendor Name" value={vendor.vendor_name} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Email" value={vendor.email} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Mobile Number" value={vendor.mobile_number} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Profession" value={vendor.profession} />
              </Col>
            </Row>
          </SectionCard>

          {/* Address */}
          <SectionCard
            icon={<MdOutlineLocationOn size={20} color="#00968b" />}
            title="Address Details"
          >
            {addr ? (
              <Row>
                <Col md={8}>
                  <InfoField label="Full Address" value={formattedAddress} />
                </Col>
                <Col md={2} sm={6}>
                  <InfoField label="State" value={addr.state} />
                </Col>
                <Col md={2} sm={6}>
                  <InfoField label="Pincode" value={addr.pincode} />
                </Col>
              </Row>
            ) : (
              <div style={styles.emptyState}>No address added</div>
            )}
          </SectionCard>

          {/* Business / Additional */}
          <SectionCard
            icon={<MdOutlineBusinessCenter size={20} color="#00968b" />}
            title="Business / Additional Details"
          >
            <Row>
              <Col md={3} sm={6}>
                <InfoField label="Shop Name" value={vendor.shop_name} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField
                  label="Profession Type"
                  value={vendor.profession_type}
                />
              </Col>
              <Col md={3} sm={6}>
                <InfoField
                  label="Commission %"
                  value={
                    vendor.commission_percentage != null
                      ? `${vendor.commission_percentage}%`
                      : null
                  }
                />
              </Col>
              <Col md={3} sm={6}>
                <InfoField
                  label="Commission Tax"
                  value={
                    vendor.commission_tax != null
                      ? `${vendor.commission_tax}%`
                      : null
                  }
                />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Godown Name" value={vendor.godown_name} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Godown Pin" value={vendor.godown_pin} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Vehicle By" value={vendor.vehicle_by} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Vehicle Name" value={vendor.vehicle_name} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="Number Plate" value={vendor.number_plate} />
              </Col>
            </Row>
          </SectionCard>

          {/* Bank Details */}
          <SectionCard
            icon={<MdOutlineAccountBalance size={20} color="#00968b" />}
            title="Bank Details"
            action={
              !bankEditing ? (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setBankEditing(true)}
                  style={styles.outlineBtn}
                >
                  <MdOutlineEdit size={16} /> Edit
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setBankEditing(false);
                      setBankEdit({
                        bankName: vendor.bank_name || "",
                        accountHolder: vendor.account_holder_name || "",
                        accountNumber: vendor.account_number || "",
                        ifscCode: vendor.ifsc_code || "",
                        branchName: vendor.bank_branch_name || "",
                      });
                    }}
                    disabled={actionLoading === "bank"}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={editBankDetails}
                    disabled={actionLoading === "bank"}
                    style={styles.primaryBtn}
                  >
                    {actionLoading === "bank" ? (
                      <>
                        <Spinner animation="border" size="sm" /> Saving...
                      </>
                    ) : (
                      <>
                        <MdOutlineSave size={16} /> Save
                      </>
                    )}
                  </Button>
                </div>
              )
            }
          >
            <Row>
              <Col md={4} sm={6} className="mb-3">
                <Form.Label style={styles.fieldLabel}>Bank Name</Form.Label>
                <Form.Control
                  size="sm"
                  name="bankName"
                  value={bankEdit.bankName}
                  onChange={handleBankEdit}
                  disabled={!bankEditing}
                  style={styles.formInput}
                />
              </Col>
              <Col md={4} sm={6} className="mb-3">
                <Form.Label style={styles.fieldLabel}>
                  Account Holder
                </Form.Label>
                <Form.Control
                  size="sm"
                  name="accountHolder"
                  value={bankEdit.accountHolder}
                  onChange={handleBankEdit}
                  disabled={!bankEditing}
                  style={styles.formInput}
                />
              </Col>
              <Col md={4} sm={6} className="mb-3">
                <Form.Label style={styles.fieldLabel}>
                  Account Number
                </Form.Label>
                <Form.Control
                  size="sm"
                  name="accountNumber"
                  value={bankEdit.accountNumber}
                  onChange={handleBankEdit}
                  disabled={!bankEditing}
                  style={styles.formInput}
                />
              </Col>
              <Col md={4} sm={6} className="mb-3">
                <Form.Label style={styles.fieldLabel}>IFSC Code</Form.Label>
                <Form.Control
                  size="sm"
                  name="ifscCode"
                  value={bankEdit.ifscCode}
                  onChange={handleBankEdit}
                  disabled={!bankEditing}
                  style={styles.formInput}
                />
              </Col>
              <Col md={4} sm={6} className="mb-3">
                <Form.Label style={styles.fieldLabel}>Branch Name</Form.Label>
                <Form.Control
                  size="sm"
                  name="branchName"
                  value={bankEdit.branchName}
                  onChange={handleBankEdit}
                  disabled={!bankEditing}
                  style={styles.formInput}
                />
              </Col>
            </Row>
          </SectionCard>

          {/* Documents */}
          <SectionCard
            icon={<MdOutlineDescription size={20} color="#00968b" />}
            title="Documents"
          >
            <Row>
              <Col md={3} sm={6}>
                <InfoField label="GST Number" value={vendor.gst_number} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField label="PAN Number" value={vendor.pan_number} />
              </Col>
              <Col md={3} sm={6}>
                <InfoField
                  label="Aadhaar Number"
                  value={vendor.aadhaar_number}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>Aadhaar Front</div>
                <LazyImage src={vendor.aadhaar_front} alt="Aadhaar Front" />
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>Aadhaar Back</div>
                <LazyImage src={vendor.aadhaar_back} alt="Aadhaar Back" />
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>PAN Front</div>
                <LazyImage src={vendor.pan_front} alt="PAN Front" />
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>PAN Back</div>
                <LazyImage src={vendor.pan_back} alt="PAN Back" />
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>Shop Image / Logo</div>
                <LazyImage src={vendor.shop_image_or_logo} alt="Shop Logo" />
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div style={styles.fieldLabel}>Vehicle Image</div>
                <LazyImage src={vendor.vehicle_image} alt="Vehicle" />
              </Col>
            </Row>
          </SectionCard>

          {/* Status & Actions */}
          <SectionCard
            icon={<MdOutlineVerifiedUser size={20} color="#00968b" />}
            title="Vendor Status & Actions"
          >
            <div className="d-flex flex-wrap gap-2">
              {(vendor.review_status === "Under Review" ||
                vendor.review_status === "Disapproved") && (
                <Button
                  onClick={makeVendorApproval}
                  disabled={!!actionLoading}
                  style={styles.approveBtn}
                >
                  {actionLoading === "approve" ? (
                    <>
                      <Spinner animation="border" size="sm" /> Approving...
                    </>
                  ) : (
                    <>
                      <IoMdCheckmarkCircleOutline size={18} /> Approve Vendor
                    </>
                  )}
                </Button>
              )}
              {(vendor.review_status === "Under Review" ||
                vendor.review_status === "Approved") && (
                <Button
                  onClick={openDisapproveModal}
                  disabled={!!actionLoading}
                  style={styles.disapproveBtn}
                >
                  <IoMdCloseCircleOutline size={18} /> Disapprove Vendor
                </Button>
              )}
              {/* {vendor.is_approved && (
                <Button
                  onClick={toggleServiceStatus}
                  disabled={!!actionLoading}
                  style={styles.neutralBtn}
                >
                  {actionLoading === "status" ? (
                    <>
                      <Spinner animation="border" size="sm" /> Updating...
                    </>
                  ) : vendor.isActive ? (
                    "Deactivate"
                  ) : (
                    "Activate"
                  )}
                </Button>
              )} */}
            </div>
          </SectionCard>
        </>
      )}

      {/* Disapprove Modal */}
      <Modal
        centered
        onHide={() => setShowDisapproveModal(false)}
        show={showDisapproveModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 18 }}>Disapprove Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            Please provide a clear reason. This will be shared with the vendor.
          </div>
          <Form.Label style={styles.fieldLabel}>
            Reason for disapproval <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError("");
            }}
            isInvalid={!!reasonError}
            style={styles.formInput}
            placeholder="Enter the reason..."
          />
          {reasonError && (
            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 6 }}>
              {reasonError}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowDisapproveModal(false)}
            disabled={actionLoading === "disapprove"}
          >
            Cancel
          </Button>
          <Button
            onClick={makeVendorDisapproval}
            disabled={actionLoading === "disapprove"}
            style={styles.disapproveBtn}
          >
            {actionLoading === "disapprove" ? (
              <>
                <Spinner animation="border" size="sm" /> Submitting...
              </>
            ) : (
              "Confirm Disapprove"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={hideToast}
          show={toast.show}
          delay={3500}
          autohide
          bg={toast.variant}
        >
          <Toast.Body style={{ color: "#fff", fontWeight: 500 }}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

const shimmerCSS = `
.skeleton-shimmer {
  background: linear-gradient(90deg, #eceef1 25%, #f6f7f9 50%, #eceef1 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.2s infinite;
  display: block;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

const styles = {
  page: {
    padding: "16px 20px",
    backgroundColor: "#f7f8fa",
    minHeight: "100vh",
  },
  card: {
    borderRadius: 10,
    background: "#ffffff",
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#e6f7f5",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1f2937",
    letterSpacing: 0.2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: 500,
    wordBreak: "break-word",
  },
  formInput: {
    fontSize: 13,
    borderRadius: 8,
    border: "1px solid #e2e6eb",
    padding: "8px 10px",
    background: "#fff",
  },
  backButton: {
    width: 30,
    height: 30,
    border: "1px solid #e2e6eb",
    borderRadius: 8,
    background: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  linkButton: {
    background: "transparent",
    border: "1px solid #00968b",
    color: "#00968b",
    padding: "6px 14px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
  },
  heroSub: {
    fontSize: 13,
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    background: "#f1f3f5",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e6eb",
  },
  statusPill: {
    padding: "6px 10px",
    fontSize: 12,
    // fontWeight: 600,
    borderRadius: 999,
  },
  professionPill: {
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    background: "#eef2ff",
    // color: "#3b4fbf",
    border: "1px solid #dce3f7",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #e2e6eb",
    background: "#f1f3f5",
  },
  imageLink: {
    display: "block",
  },
  imageBox: {
    width: "100%",
    borderRadius: 8,
    border: "1px dashed #e2e6eb",
    background: "#f8f9fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  imageEmpty: {
    color: "#9aa1ad",
    fontSize: 12,
  },
  emptyState: {
    textAlign: "center",
    color: "#9aa1ad",
    fontSize: 13,
    padding: "14px 0",
  },
  approveBtn: {
    border: 0,
    backgroundColor: "#00968b",
    color: "#fff",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  disapproveBtn: {
    border: 0,
    backgroundColor: "#ff005d",
    color: "#fff",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  neutralBtn: {
    border: "1px solid #d0d5dd",
    backgroundColor: "#fff",
    color: "#374151",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
  },
  primaryBtn: {
    border: 0,
    backgroundColor: "#00968b",
    color: "#fff",
    fontWeight: 600,
    padding: "6px 14px",
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  outlineBtn: {
    fontSize: 13,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
  },
};

export default VendorDetails;
