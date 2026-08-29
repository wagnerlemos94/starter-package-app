import {
  Box,
  Divider,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  CircularProgress,
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
  // `errors` can be the full form errors or already the nested `endereco` errors.
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        marginTop: 2,        
      }}
    >
      <Divider>Endereço</Divider>
      <Grid container spacing={2} sx={{ width: "100%", marginTop: 1 }}>
        <Grid>
          <Controller
            name={`${namePrefix}.cep` as any}
            control={control}
            render={({ field }) => (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextFieldMask
                  id="outlined-cep"
                  label="CEP"
                  placeholder="00000-000"
                  fullWidth
                  size="small"
                  margin="dense"
                  mask="99999-999"
                  error={
                    !!(
                      (errors as any)?.[namePrefix]?.cep ?? (errors as any)?.cep
                    )
                  }
                  helperText={
                    ((errors as any)?.[namePrefix]?.cep?.message ??
                      (errors as any)?.cep?.message) as any
                  }
                  {...field}
                />
                <Button
                  size="small"
                  onClick={() => buscarViaCep(field.value || "")}
                  disabled={cepLoading}
                  sx={{ marginLeft: "-25px", marginRight: "-30px" }}
                >
                  {cepLoading ? <CircularProgress size={18} /> : <SearchIcon />}
                </Button>
              </Box>
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.logradouro` as any}
            control={control}
            render={({ field }) => (
              <TextField
                id="outlined-logradouro"
                label="Rua"
                placeholder="Nome da rua"
                fullWidth
                size="small"
                margin="dense"
                error={
                  !!(
                    (errors as any)?.[namePrefix]?.logradouro ??
                    (errors as any)?.logradouro
                  )
                }
                helperText={
                  ((errors as any)?.[namePrefix]?.logradouro.message ??
                    (errors as any)?.logradouro?.message) as any
                }
                {...field}
              />
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.numero` as any}
            control={control}
            render={({ field }) => (
              <TextField
                id="outlined-numero"
                label="Número"
                placeholder="Número"
                defaultValue=""
                fullWidth
                size="small"
                margin="dense"
                focused={true}
                error={
                  !!(
                    (errors as any)?.[namePrefix]?.numero ??
                    (errors as any)?.numero
                  )
                }
                helperText={
                  ((errors as any)?.[namePrefix]?.numero?.message ??
                    (errors as any)?.numero?.message) as any
                }
                {...register(`${namePrefix}.numero` as any)}
              />
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.complemento` as any}
            control={control}
            render={({ field }) => (
              <TextField
                id="outlined-complemento"
                label="Complemento"
                placeholder="Apartamento, bloco, casa, etc. (opcional)"
                defaultValue=""
                fullWidth
                size="small"
                margin="dense"
                focused={true}
                error={
                  !!(
                    (errors as any)?.[namePrefix]?.complemento ??
                    (errors as any)?.complemento
                  )
                }
                helperText={
                  ((errors as any)?.[namePrefix]?.complemento?.message ??
                    (errors as any)?.complemento?.message) as any
                }
                {...register(`${namePrefix}.complemento` as any)}
              />
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.bairro` as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={
                  !!(
                    (errors as any)?.[namePrefix]?.bairro ??
                    (errors as any)?.bairro
                  )
                }
                helperText={
                  ((errors as any)?.[namePrefix]?.bairro?.message ??
                    (errors as any)?.bairro?.message) as any
                }
                id="outlined-bairro"
                label="Bairro"
                placeholder="Nome do bairro"
                fullWidth
                size="small"
                margin="dense"
              />
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.cidade` as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={
                  !!(
                    (errors as any)?.[namePrefix]?.cidade ??
                    (errors as any)?.cidade
                  )
                }
                helperText={
                  ((errors as any)?.[namePrefix]?.cidade?.message ??
                    (errors as any)?.cidade?.message) as any
                }
                id="outlined-cidade"
                label="Cidade"
                placeholder="Nome da cidade"
                fullWidth
                size="small"
                margin="dense"
              />
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name={`${namePrefix}.estado` as any}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel id={`estado-label-${namePrefix}`}>
                  Estado
                </InputLabel>
                <Select
                  labelId={`estado-label-${namePrefix}`}
                  id="outlined-estado"
                  label="Estado"
                  {...field}
                  error={
                    !!(
                      (errors as any)?.[namePrefix]?.estado ??
                      (errors as any)?.estado
                    )
                  }
                  size="small"
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
