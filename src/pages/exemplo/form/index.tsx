import { Box, Button, Grid, TextField } from "@mui/material";
import DatePickerField from "@/components/DatePickerField";
import TextFieldMask from "@/components/TextFieldMask";
import useForm from "./useFormExempo";
import { Controller } from "react-hook-form";
import FormComponent from "@/components/FormComponent";
import SelectComponent from "@/components/SelectComponet";
import EnderecoForm from "@/layout/componets/EnderecoForm";
import ContatosForm from "@/layout/componets/ContatosForm";

export default function Form() {
    const {
        action: {
            salvar,
            setOpen
        },
        data: {
            register,
            errors,
            control,
            setValue,
            loading,
            isSubmitting,
            open,
            optionsResponsavel,
        }
    } = useForm();

    return (
        <FormComponent
            onSubmit={salvar}
            titulo="Formulário de exemplo"
            subTitulo={["Exemplo /", "Novo"]}
            isSubmitting={isSubmitting || loading}>

            <Box
                sx={{
                    width: '100%',
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <TextField
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                        id="outlined-error"
                        label={control._formValues.nome ? "" : "Nome completo"}
                        placeholder="Nome completo"
                        defaultValue=""
                        fullWidth
                        {...register("nome")}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Controller
                            name="nascimento"
                            control={control}
                            render={({ field }) => (
                                <DatePickerField
                                    label="Nascimento"
                                    error={!!errors.nascimento}
                                    helperText={errors.nascimento?.message}
                                    value={field.value ?? null}
                                    onChange={(date: Date | null) => field.onChange(date ?? undefined)}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Controller
                            name="cpf"
                            control={control}
                            render={({ field }) => (
                                <TextFieldMask
                                    {...field}
                                    error={!!errors.cpf}
                                    helperText={errors.cpf?.message}
                                    id="outlined-error-helper-text"
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    fullWidth
                                    mask="999.999.999-99"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            error={!!errors.rg}
                            helperText={errors.rg?.message}
                            id="outlined-error-helper-text"
                            label="RG"
                            placeholder="00.000.000-0"
                            defaultValue=""
                            fullWidth
                            {...register("rg")}
                        />
                    </Box>
                    <Box sx={{ flex: 1, marginTop: 1 }}>
                        <Controller
                            name="responsavel"
                            control={control}
                            render={({ field }) => (
                                <SelectComponent
                                    options={optionsResponsavel}
                                    name="Responsável"
                                    error={!!errors.responsavel}
                                    helperText={errors.responsavel?.message}
                                    value={field.value ?? ''}
                                    onChange={(v) => field.onChange(v)}
                                />
                            )}
                        />
                    </Box>
                </Box>
            </Box>
            <EnderecoForm
                register={register}
                errors={errors.endereco}
                control={control}
                setValue={setValue}
            />
            <ContatosForm
                register={register}
                errors={errors.contato}
                control={control}
                setValue={setValue}        
            />
            
        </FormComponent>
    );
}