import { Alert, Fade, Snackbar } from "@mui/material";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

type ToastSeverity = "success" | "info" | "warning" | "error";

interface ToastContextData {
    showToast: (message: string, severity?: ToastSeverity, duration?: number) => void;
    hideToast: () => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

interface ToastState {
    open: boolean;
    message: string;
    severity: ToastSeverity;
    duration: number;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
    const [toastKey, setToastKey] = useState(0);
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: "",
        severity: "info",
        duration: 4000,
    });

    const showToast = useCallback(
        (message: string, severity: ToastSeverity = "info", duration = 4000) => {
            setToastKey((prev) => prev + 1);
            setToast({
                open: true,
                message,
                severity,
                duration,
            });
        },
        [],
    );

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    const contextValue = useMemo(
        () => ({
            showToast,
            hideToast,
        }),
        [showToast, hideToast],
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <Snackbar
                key={toastKey}
                open={toast.open}
                autoHideDuration={toast.duration}
                onClose={hideToast}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={Fade}
            >
                <Alert variant="filled" severity={toast.severity} onClose={hideToast}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast deve ser usado dentro de ToastProvider");
    }

    return context;
}