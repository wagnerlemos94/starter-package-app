import { Box, Grid, TextField } from "@mui/material";
import DatePickerField from "@/components/DatePickerField";
import TextFieldMask from "@/components/TextFieldMask";
import useForm from "@/features/exemplo/useFormExemplo";
import { Controller } from "react-hook-form";
import FormComponent from "@/components/FormComponent";
import SelectComponent from "@/components/SelectComponent";
import EnderecoForm from "@/layout/components/EnderecoForm";
import ContatosForm from "@/layout/components/ContatosForm";

export default function Form() {
    const {
        action: {
            salvar,
        },
        data: {
            register,
            errors,
            control,
            setValue,
            loading,
            isSubmitting,
            optionsResponsavel,
        }
    } = useForm();

    return (
        <FormComponent
            onSubmit={salvar}
            titulo="Formulário de exemplo"
            subTitulo={["Exemplo /", "Novo"]}
            isSubmitting={isSubmitting || loading}
        >
            <Box sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            label="Nome completo"
                            placeholder="Nome completo"
                            fullWidth
                            {...register("nome")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Controller
                            name="nascimento"
                            control={control}
                            render={({ field }) => (
                                <DatePickerField
                                    label="Nascimento"
                                    error={!!errors.nascimento}
                                    helperText={errors.nascimento?.message}
                                    value={field.value ?? null}
                                    onChange={(date: Date | null) =>
                                        field.onChange(date ?? undefined)
                                    }
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Controller
                            name="cpf"
                            control={control}
                            render={({ field }) => (
                                <TextFieldMask
                                    {...field}
                                    error={!!errors.cpf}
                                    helperText={errors.cpf?.message}
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    fullWidth
                                    mask="999.999.999-99"
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            error={!!errors.rg}
                            helperText={errors.rg?.message}
                            label="RG"
                            placeholder="00.000.000-0"
                            fullWidth
                            {...register("rg")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Controller
                            name="responsavel"
                            control={control}
                            render={({ field }) => (
                                <SelectComponent
                                    options={optionsResponsavel}
                                    name="Responsável"
                                    error={!!errors.responsavel}
                                    helperText={errors.responsavel?.message}
                                    value={field.value ?? ""}
                                    onChange={(v) => field.onChange(v)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
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
