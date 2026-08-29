import { CircularProgress } from "@mui/material";

export default function Loading({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }}>
            <CircularProgress size="3rem" aria-label="Loading…" />
        </div>
    );
}