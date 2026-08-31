import {
    Alert,
    Fade,
    Snackbar,
} from "@mui/material";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { theme } from "@/layout/globalStyles/theme";

type ToastSeverity = "success" | "info" | "warning" | "error";

interface ToastContextData {
    showToast: (
        message: string,
        severity?: ToastSeverity,
        duration?: number
    ) => void;

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

const ToastContext = createContext<ToastContextData | undefined>(
    undefined
);

export function ToastProvider({
    children,
}: ToastProviderProps) {

    const [toastKey, setToastKey] = useState(0);

    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: "",
        severity: "info",
        duration: 4000,
    });

    const showToast = useCallback(
        (
            message: string,
            severity: ToastSeverity = "info",
            duration = 4000
        ) => {

            setToastKey((prev) => prev + 1);

            setToast({
                open: true,
                message,
                severity,
                duration,
            });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    const contextValue = useMemo(
        () => ({
            showToast,
            hideToast,
        }),
        [showToast, hideToast]
    );

    const getToastStyle = (
        severity: ToastSeverity
    ) => {

        switch (severity) {

            case "success":
                return {
                    backgroundColor:
                        theme.color.successLight,

                    borderColor:
                        theme.color.success,

                    color:
                        theme.color.textPrimary,
                };

            case "error":
                return {
                    backgroundColor:
                        theme.color.dangerLight,

                    borderColor:
                        theme.color.danger,

                    color:
                        theme.color.textPrimary,
                };

            case "warning":
                return {
                    backgroundColor:
                        theme.color.warningLight,

                    borderColor:
                        theme.color.warning,

                    color:
                        theme.color.textPrimary,
                };

            case "info":
            default:
                return {
                    backgroundColor:
                        theme.color.infoLight,

                    borderColor:
                        theme.color.info,

                    color:
                        theme.color.textPrimary,
                };
        }
    };

    const toastStyle =
        getToastStyle(toast.severity);

    return (
        <ToastContext.Provider
            value={contextValue}
        >
            {children}

            <Snackbar
                key={toastKey}
                open={toast.open}
                autoHideDuration={toast.duration}
                onClose={hideToast}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    top: {
                        xs: 16,
                        sm: `${theme.layout.headerHeight + 16}px`,
                    },

                    right: {
                        xs: 16,
                        sm: 24,
                    },

                    maxWidth: {
                        xs: "calc(100% - 32px)",
                        sm: 420,
                    },
                }}
            >
                <Alert
                    severity={toast.severity}
                    onClose={hideToast}
                    variant="outlined"
                    sx={{
                        width: "100%",

                        minWidth: {
                            sm: 340,
                        },

                        py: 0.75,
                        px: 1.5,

                        borderRadius:
                            `${theme.radius.md}px`,

                        backgroundColor:
                            toastStyle.backgroundColor,

                        borderColor:
                            toastStyle.borderColor,

                        color:
                            toastStyle.color,

                        boxShadow:
                            theme.shadow.md,

                        alignItems: "center",

                        fontSize: "0.9rem",
                        fontWeight: 500,

                        "& .MuiAlert-icon": {
                            color:
                                toastStyle.borderColor,
                            alignItems: "center",
                        },

                        "& .MuiAlert-action": {
                            alignItems: "center",
                            paddingTop: 0,
                        },

                        "& .MuiIconButton-root": {
                            color:
                                theme.color.textSecondary,
                        },
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast() {

    const context =
        useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast deve ser usado dentro de ToastProvider"
        );
    }

    return context;
}