import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Offcanvas,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { apiUrl } from "../../../api-services/apiContents";
import { useAdminDataContext } from "../../../utilities/adminData";
import { useConfirm } from "../../common/ConfirmProvider";

const MIN_PASSWORD_LEN = 6;

function LandingPage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { adminData, setAdminData } = useAdminDataContext();
  const confirm = useConfirm();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [openPopUp, setOpenPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    if (openPopUp) {
      setPassword(adminData?.password || "");
      setConfirmPassword(adminData?.password || "");
      setTouched({ password: false, confirm: false });
      setShowPassword(false);
    }
  }, [openPopUp, adminData]);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
  }, []);

  const passwordError = useMemo(() => {
    if (!password) return "Password is required";
    if (password.length < MIN_PASSWORD_LEN)
      return `Password must be at least ${MIN_PASSWORD_LEN} characters`;
    return "";
  }, [password]);

  const confirmError = useMemo(() => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  }, [confirmPassword, password]);

  const isUnchanged = useMemo(
    () => !!adminData?.password && password === adminData.password,
    [password, adminData],
  );

  const canSubmit =
    !loading && !passwordError && !confirmError && !isUnchanged;

  const editPassword = useCallback(async () => {
    if (loading) return;
    if (passwordError || confirmError) {
      setTouched({ password: true, confirm: true });
      showToast("Please fix the highlighted fields", "danger");
      return;
    }
    if (isUnchanged) {
      showToast("New password is the same as the current one", "warning");
      return;
    }

    const ok = await confirm({
      title: "Update Password",
      message:
        "Are you sure you want to update your password? You'll use the new password next time you login.",
      confirmText: "Yes, Update",
      cancelText: "No",
      variant: "primary",
    });
    if (!ok) return;

    setLoading(true);
    try {
      const response = await axios({
        url: `${apiUrl.UPDATE_PASSWORD}${user._id}`,
        method: "put",
        baseURL: apiUrl.BASEURL,
        headers: { "Content-Type": "application/json" },
        data: { password: password.trim() },
      });
      if (response.status === 200 && response.data?.data) {
        setAdminData(response.data.data);
        showToast(
          response.data.message || "Password updated successfully",
          "success",
        );
        setTimeout(() => setOpenPopUp(false), 900);
      } else {
        showToast("Password could not be updated", "danger");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";
      showToast(msg, "danger");
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    passwordError,
    confirmError,
    isUnchanged,
    confirm,
    user._id,
    password,
    setAdminData,
    showToast,
  ]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#3779eb",
          }}
          onClick={() => setOpenPopUp(true)}
        >
          My Profile{" "}
        </p>
      </div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          height: "100vh",
        }}
      >
        <h2>Welcome! {adminData ? adminData?.member_name : ""}</h2>
      </div>

      <Offcanvas
        show={openPopUp}
        placement="end"
        onHide={() => !loading && setOpenPopUp(false)}
        backdrop={loading ? "static" : true}
      >
        <Offcanvas.Header closeButton={!loading}>
          <Offcanvas.Title>My Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>Name</Form.Label>
            <Form.Control
              size="sm"
              disabled
              value={adminData?.member_name || ""}
              style={styles.input}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>Mobile Number</Form.Label>
            <Form.Control
              size="sm"
              disabled
              value={adminData?.mobile_number || ""}
              style={styles.input}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>Email</Form.Label>
            <Form.Control
              size="sm"
              disabled
              value={adminData?.email_id || ""}
              style={styles.input}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={styles.label}>
              New Password <span style={{ color: "#dc3545" }}>*</span>
            </Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                size="sm"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                maxLength={64}
                autoComplete="new-password"
                isInvalid={touched.password && !!passwordError}
                style={{ ...styles.input, paddingRight: 36 }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff size={18} color="#6b7280" />
                ) : (
                  <MdVisibility size={18} color="#6b7280" />
                )}
              </button>
            </div>
            {touched.password && passwordError && (
              <div style={styles.errorText}>{passwordError}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>
              Confirm Password <span style={{ color: "#dc3545" }}>*</span>
            </Form.Label>
            <Form.Control
              size="sm"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              maxLength={64}
              autoComplete="new-password"
              isInvalid={touched.confirm && !!confirmError}
              style={styles.input}
              disabled={loading}
            />
            {touched.confirm && confirmError && (
              <div style={styles.errorText}>{confirmError}</div>
            )}
          </Form.Group>

          {isUnchanged && password && (
            <div style={styles.noteText}>
              This is the same as your current password.
            </div>
          )}

          <div className="d-flex gap-2 mt-3">
            <Button
              variant="light"
              onClick={() => !loading && setOpenPopUp(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={editPassword}
              disabled={!canSubmit}
              style={{ minWidth: 160 }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setToast((t) => ({ ...t, show: false }))}
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
    </>
  );
}

const styles = {
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    fontSize: 13,
    borderRadius: 8,
    border: "1px solid #e2e6eb",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  noteText: {
    color: "#b98900",
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
  },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: 0,
    padding: 2,
    cursor: "pointer",
  },
};

export default LandingPage;
