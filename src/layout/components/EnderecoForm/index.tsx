import {
  Box,
  Divider,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import TextFieldMask from "@/components/TextFieldMask";
import SearchIcon from "@mui/icons-material/Search";
import { useEnderecoForm } from "./useEnderecoForm";

type EnderecoFormProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
> = {
  register: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues> | FieldErrors<any> | undefined;
  control?: Control<TFieldValues>;
  setValue?: UseFormSetValue<TFieldValues>;
  namePrefix?: string;
};

export default function EnderecoForm<
  TFieldValues extends Record<string, any> = Record<string, any>,
>({
  register,
  errors,
  control,
  setValue,
  namePrefix = "endereco",
}: EnderecoFormProps<TFieldValues>) {
  const {
    action: { buscarViaCep },
    data: { cepLoading, UFS },
  } = useEnderecoForm({ setValue, namePrefix });

  const getError = (field: string) => {
    return (
      (errors as any)?.[namePrefix]?.[field] ??
      (errors as any)?.[field]
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 3,
      }}
    >
      <Divider
        textAlign="left"
        sx={{
          mb: 2,
          color: "#0F172A",
          fontWeight: 700,
          fontSize: "0.9rem",
        }}
      >
        Endereço
      </Divider>

      <Grid container spacing={2}>
        {/* CEP */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Controller
            name={`${namePrefix}.cep` as any}
            control={control}
            render={({ field }) => (
              <TextFieldMask
                {...field}
                id="outlined-cep"
                label="CEP"
                placeholder="00000-000"
                fullWidth
                size="small"
                mask="99999-999"
                error={!!getError("cep")}
                helperText={getError("cep")?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => buscarViaCep(field.value || "")}
                          disabled={cepLoading}
                          aria-label="Buscar CEP"
                        >
                          {cepLoading ? (
                            <CircularProgress size={18} />
                          ) : (
                            <SearchIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Rua */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name={`${namePrefix}.logradouro` as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-logradouro"
                label="Rua"
                placeholder="Nome da rua"
                fullWidth
                size="small"
                error={!!getError("logradouro")}
                helperText={getError("logradouro")?.message}
              />
            )}
          />
        </Grid>

        {/* Número */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Controller
            name={`${namePrefix}.numero` as any}
            control={control}
            render={() => (
              <TextField
                id="outlined-numero"
                label="Número"
                placeholder="Número"
                fullWidth
                size="small"
                error={!!getError("numero")}
                helperText={getError("numero")?.message}
                {...register(`${namePrefix}.numero` as any)}
              />
            )}
          />
        </Grid>

        {/* Complemento */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Controller
            name={`${namePrefix}.complemento` as any}
            control={control}
            render={() => (
              <TextField
                id="outlined-complemento"
                label="Complemento"
                placeholder="Apto, bloco..."
                fullWidth
                size="small"
                error={!!getError("complemento")}
                helperText={getError("complemento")?.message}
                {...register(`${namePrefix}.complemento` as any)}
              />
            )}
          />
        </Grid>

        {/* Bairro */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name={`${namePrefix}.bairro` as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-bairro"
                label="Bairro"
                placeholder="Nome do bairro"
                fullWidth
                size="small"
                error={!!getError("bairro")}
                helperText={getError("bairro")?.message}
              />
            )}
          />
        </Grid>

        {/* Cidade */}
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <Controller
            name={`${namePrefix}.cidade` as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-cidade"
                label="Cidade"
                placeholder="Nome da cidade"
                fullWidth
                size="small"
                error={!!getError("cidade")}
                helperText={getError("cidade")?.message}
              />
            )}
          />
        </Grid>

        {/* Estado */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Controller
            name={`${namePrefix}.estado` as any}
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                size="small"
                error={!!getError("estado")}
              >
                <InputLabel id={`estado-label-${namePrefix}`}>
                  Estado
                </InputLabel>

                <Select
                  {...field}
                  labelId={`estado-label-${namePrefix}`}
                  id="outlined-estado"
                  label="Estado"
                >
                  {UFS.map((uf) => (
                    <MenuItem key={uf} value={uf}>
                      {uf}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
