import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmContext = createContext(null);

const DEFAULTS = {
  title: "Please confirm",
  message: "Are you sure you want to proceed?",
  confirmText: "Yes",
  cancelText: "No",
  variant: "danger",
};

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, ...DEFAULTS });
  const resolverRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({ ...DEFAULTS, ...opts, open: true });
    });
  }, []);

  const finish = useCallback((result) => {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    setState((s) => ({ ...s, open: false }));
    if (resolver) resolver(result);
  }, []);

  const ctx = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={ctx}>
      {children}
      <Modal
        show={state.open}
        onHide={() => finish(false)}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 17, fontWeight: 600 }}>
            {state.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: 14, color: "#374151" }}>
          {state.message}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            size="sm"
            onClick={() => finish(false)}
            style={{ fontWeight: 600, minWidth: 80 }}
          >
            {state.cancelText}
          </Button>
          <Button
            variant={state.variant}
            size="sm"
            onClick={() => finish(true)}
            style={{ fontWeight: 600, minWidth: 80 }}
          >
            {state.confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    return async () => window.confirm("Are you sure?");
  }
  return ctx.confirm;
}
