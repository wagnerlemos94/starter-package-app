import { Box, Container, Divider, Typography } from "@mui/material";
import Loading from "./Loading";
import Button from "@/layout/componets/Button";
import { useRouter } from "next/router";
import { theme } from "@/layout/globalStyles/theme";

interface FormComponentProps {
    onSubmit: (e?: React.FormEvent) => void;
    titulo: string;
    subTitulo?: Array<string>;
    isSubmitting: boolean;
    children: React.ReactNode;
    loading?: boolean;
    btnCancelar?: boolean;
}

export default function FormComponent({
    onSubmit,
    titulo,
    subTitulo,
    isSubmitting,
    children,
    btnCancelar = true,
}: FormComponentProps) {
    const router = useRouter();

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: { xs: 2, md: 4 },
                px: { xs: 2, md: 3 },
            }}
        >
            <Box
                component="section"
                sx={{
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                    overflow: "hidden",
                }}
            >
                <form onSubmit={onSubmit}>
                    <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                        <Box sx={{ mb: subTitulo?.length ? 1 : 3 }}>
                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                                    fontWeight: 700,
                                    color: "#111827",
                                    lineHeight: 1.25,
                                }}
                            >
                                {titulo}
                            </Typography>
                        </Box>

                        {subTitulo && subTitulo.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.75,
                                    mb: 3,
                                    color: "#6B7280",
                                }}
                            >
                                {subTitulo.map((item, index) => (
                                    <Typography
                                        key={index}
                                        component="span"
                                        variant="body2"
                                        sx={{ color: "inherit" }}
                                    >
                                        {item}
                                    </Typography>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ width: "100%" }}>{children}</Box>

                        <Divider sx={{ mt: 4, mb: 2.5, borderColor: "#EEF0F3" }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1.5,
                            }}
                        >
                            {btnCancelar && (
                                <Button
                                    backgroundColor='buttonSecondary'
                                    color="black"
                                    nome="Cancelar"
                                    onClick={() => {
                                        if (typeof window !== "undefined" && window.history.length > 1) {
                                            router.back();
                                            return;
                                        }
                                        router.push("/");
                                    }}
                                />
                            )}

                            <Button nome="Salvar" type="submit" />
                        </Box>
                    </Box>

                    <Loading isLoading={isSubmitting} />
                </form>
            </Box>
        </Container>
    );
}
