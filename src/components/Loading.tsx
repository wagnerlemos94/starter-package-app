import { Box, CircularProgress } from "@mui/material";

export default function Loading({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(2px)',
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 3,
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                }}
            >
                <CircularProgress size="2.25rem" aria-label="Loading…" />
            </Box>
        </Box>
    );
}
