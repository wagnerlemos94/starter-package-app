import { Box, Divider, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from "@mui/material";
import { Control, Controller, UseFormSetValue, UseFormRegister, FieldErrors, useFieldArray } from "react-hook-form";
import SelectComponent from "@/components/SelectComponet";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { theme } from "@/layout/globalStyles/theme";


type ContatosFormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
    register: UseFormRegister<TFieldValues>;
    // `errors` can be the full form errors or already the nested `contato` errors.
    errors?: FieldErrors<TFieldValues> | FieldErrors<any> | undefined;
    control?: Control<TFieldValues>;
    setValue?: UseFormSetValue<TFieldValues>;
    namePrefix?: string;
}

export interface Contato {
    tipo: string;
    tipoId: number;
    contato: string;

}

export default function ContatosForm<TFieldValues extends Record<string, any> = Record<string, any>>(
    { register, errors, control, setValue, namePrefix = 'contatos' }: ContatosFormProps<TFieldValues>
) {
    const safeName = namePrefix ?? 'contato';

    // Provide a graceful fallback if no control is passed
    const fieldArray = control ? useFieldArray({ control: control as any, name: safeName as any }) : null;
    const fields = fieldArray?.fields ?? [];
    const append = fieldArray?.append;
    const remove = fieldArray?.remove;

    const getError = (index: number, key: string) => {
        const e = errors as any;
        if (!e) return undefined;
        if (Array.isArray(e) && e[index]) return e[index]?.[key]?.message;
        if (e[index]) return e[index]?.[key]?.message;
        if (e[safeName] && e[safeName][index]) return e[safeName][index]?.[key]?.message;
        return e?.[key]?.message;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', marginTop: 2 }} >
            <Divider>Contatos</Divider>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => append ? append({ tipo: '', contato: '' }) : null}
                >
                    Adicionar
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Contato</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((f, index) => (
                            <TableRow key={f.id}>
                                <TableCell sx={{ width: '60%' }}>
                                    <TextField
                                        error={!!getError(index, 'contato')}
                                        helperText={getError(index, 'contato') as any}
                                        fullWidth
                                        defaultValue={(f as any).contato ?? ''}
                                        {...register(`${safeName}.${index}.contato` as any)}
                                    />
                                </TableCell>
                                <TableCell sx={{ width: '30%' }}>
                                    <Controller
                                        name={`${safeName}.${index}.tipo` as any}
                                        control={control}
                                        defaultValue={(f as any).tipo ?? ''}
                                        render={({ field: ctlField }) => (
                                            <SelectComponent
                                                options={[
                                                    { value: '0', label: 'Fixo' },
                                                    { value: '1', label: 'Celular' },
                                                    { value: '2', label: 'Email' },
                                                ]}
                                                name="Tipo"
                                                error={!!getError(index, 'tipo')}
                                                helperText={getError(index, 'tipo') as any}
                                                value={ctlField.value ?? ''}
                                                onChange={(v) => ctlField.onChange(v)}
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => remove ? remove(index) : null}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}