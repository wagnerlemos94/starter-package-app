import {
  Box,
  Divider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
  useFieldArray,
} from "react-hook-form";
import SelectComponent from "@/components/SelectComponet";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Button from "@/layout/componets/Button";

type ContatosFormProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
> = {
  register: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues> | FieldErrors<any> | undefined;
  control?: Control<TFieldValues>;
  setValue?: UseFormSetValue<TFieldValues>;
  namePrefix?: string;
};

export interface Contato {
  tipo: string;
  tipoId: number;
  contato: string;
}

export default function ContatosForm<
  TFieldValues extends Record<string, any> = Record<string, any>,
>({
  register,
  errors,
  control,
  setValue,
  namePrefix = "contatos",
}: ContatosFormProps<TFieldValues>) {
  const safeName = namePrefix ?? "contato";

  const fieldArray = control
    ? useFieldArray({
      control: control as any,
      name: safeName as any,
    })
    : null;

  const fields = fieldArray?.fields ?? [];
  const append = fieldArray?.append;
  const remove = fieldArray?.remove;

  const getError = (index: number, key: string) => {
    const e = errors as any;

    if (!e) return undefined;

    if (Array.isArray(e) && e[index]) {
      return e[index]?.[key]?.message;
    }

    if (e[index]) {
      return e[index]?.[key]?.message;
    }

    if (e[safeName] && e[safeName][index]) {
      return e[safeName][index]?.[key]?.message;
    }

    return e?.[key]?.message;
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 3,
      }}
    >
      {/* Título da seção */}
      <Divider
        textAlign="left"
        sx={{
          mb: 1.5,
          color: "#0F172A",
          fontWeight: 700,
          fontSize: "0.9rem",
        }}
      >
        Contatos
      </Divider>

      {/* Ações */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Button
          nome="Adicionar"
          icon={<AddIcon fontSize="small" />}
          backgroundColor="infoHover"
          onClick={() =>
            append
              ? append({
                tipo: "",
                contato: "",
              })
              : null
          }
          sx={{
            minHeight: 34,
            px: 1.75,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        />
      </Box>

      {/* Tabela */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #E5E7EB",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: "fixed",

            "& .MuiTableCell-root": {
              borderColor: "#E5E7EB",
            },
          }}
        >
          {/* Cabeçalho */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#F8FAFC",
              }}
            >
              <TableCell
                sx={{
                  width: "60%",
                  py: 1,
                  px: 2,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Contato
              </TableCell>

              <TableCell
                sx={{
                  width: "30%",
                  py: 1,
                  px: 2,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Tipo
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  width: "10%",
                  py: 1.25,
                  px: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    py: 3,
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#64748B",
                    }}
                  >
                    Nenhum contato adicionado.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "0.8rem",
                      color: "#94A3B8",
                    }}
                  >
                    Clique em "Adicionar" para incluir um contato.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              fields.map((f, index) => (
                <TableRow
                  key={f.id}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },

                    "&:hover": {
                      backgroundColor: "#FAFBFC",
                    },
                  }}
                >
                  {/* Contato */}
                  <TableCell
                    sx={{
                      px: 2,
                      py: 0.75,
                      verticalAlign: "middle",
                    }}
                  >
                    <TextField
                      error={!!getError(index, "contato")}
                      helperText={getError(index, "contato") as any}
                      fullWidth
                      size="small"
                      placeholder="Telefone ou e-mail"
                      defaultValue={(f as any).contato ?? ""}
                      {...register(
                        `${safeName}.${index}.contato` as any,
                      )}
                    />
                  </TableCell>

                  {/* Tipo */}
                  <TableCell
                    sx={{
                      px: 2,
                      py: 0.75,
                      verticalAlign: "middle",
                    }}
                  >
                    <Controller
                      name={`${safeName}.${index}.tipo` as any}
                      control={control}
                      defaultValue={(f as any).tipo ?? ""}
                      render={({ field: ctlField }) => (
                        <SelectComponent
                          options={[
                            {
                              value: "0",
                              label: "Fixo",
                            },
                            {
                              value: "1",
                              label: "Celular",
                            },
                            {
                              value: "2",
                              label: "Email",
                            },
                          ]}
                          name="Tipo"
                          error={!!getError(index, "tipo")}
                          helperText={
                            getError(index, "tipo") as any
                          }
                          value={ctlField.value ?? ""}
                          onChange={(v) =>
                            ctlField.onChange(v)
                          }
                        />
                      )}
                    />
                  </TableCell>

                  {/* Ações */}
                  <TableCell
                    align="center"
                    sx={{
                      px: 1,
                      py: 0.75,
                      verticalAlign: "middle",
                    }}
                  >
                    <Tooltip title="Remover contato">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          remove ? remove(index) : null
                        }
                        sx={{
                          width: 34,
                          height: 34,
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}