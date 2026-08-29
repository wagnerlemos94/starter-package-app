import { Box, Container, Divider } from "@mui/material";
import Loading from "./Loading";
import Button from "@/layout/componets/Button";
import { useRouter } from "next/router";

interface FormComponentProps {
    onSubmit: (e?: React.FormEvent) => void;
    titulo: string;
    subTitulo?: Array<string>;
    isSubmitting: boolean;
    children: React.ReactNode;
    loading?: boolean; 
    btnCancelar?: boolean;

}

export default function FormComponent({ onSubmit, titulo, subTitulo, isSubmitting, children, btnCancelar = true }: FormComponentProps) {
    const router = useRouter();
    return (
        <Container maxWidth={'lg'} sx={{
            marginTop: 10,
            border: '1px solid #ccc',
            boxShadow: '0px 0px 100px rgba(0, 0, 0, 0.1)',
            height: '100%',
            padding: 4,
        }}>
            <form onSubmit={onSubmit}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 16,
                        marginLeft: 11,
                    }}>
                        <h3>{titulo}</h3>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        marginBottom: 16,
                        marginLeft: 11,
                    }}>
                        {subTitulo && subTitulo.map((item, index) => (
                            <span key={index} style={{ marginRight: 8 }}>{item}</span>
                        ))}
                    </div>
                    {children}

                    <Divider flexItem sx={{ marginTop: '0.9rem', marginBottom: '0.9rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 8, marginTop: 16 }}>
                        {btnCancelar && (
                            <Button
                                backgroundColor="white"
                                color="black"
                                nome='Cancelar'
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.history.length > 1) {
                                        router.back();
                                        return;
                                    }
                                    router.push('/');
                                }}
                            />
                        )
                        }

                        <Button
                            nome='Salvar'
                            type="submit"
                        />
                    </div>
                </Box >
                <Loading isLoading={isSubmitting} />
            </form>
        </Container>
    )
}