import FormComponent from "@/components/FormComponent";
import useFormPerfil from "@/features/perfil/useFormPerfil";

import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Checkbox,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

import { Controller } from "react-hook-form";
import { theme } from "@/layout/globalStyles/theme";

export default function FormPerfil() {
  const {
    action: { salvar, register },
    data: {
      isSubmitting,
      errors,
      control,
      loading,
      listRecurso,
      listPermissao,
      perfilRecurso,
    },
  } = useFormPerfil();

  return (
    <FormComponent
      onSubmit={salvar}
      titulo="Formulário de Cadastro Perfil"
      isSubmitting={isSubmitting || loading}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* Dados do perfil */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Controller
              name="nome"
              control={control}
              render={() => (
                <TextField
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  label="Nome"
                  placeholder="Nome do perfil"
                  fullWidth
                  size="small"
                  {...register("nome")}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Controller
              name="descricao"
              control={control}
              render={() => (
                <TextField
                  {...register("descricao")}
                  error={!!errors.descricao}
                  helperText={errors.descricao?.message}
                  label="Descrição"
                  placeholder="Descrição do perfil"
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 2 }}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(_e, checked) =>
                        field.onChange(checked)
                      }
                      color="success"
                    />
                  }
                  label="Ativo"
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Seção */}
        <Divider
          textAlign="left"
          sx={{
            mt: 3,
            mb: 2,
            color: theme.color.textPrimary,
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          Recursos e Permissões
        </Divider>

        <Typography
          sx={{
            mb: 2.5,
            color: theme.color.textSecondary,
            fontSize: "0.875rem",
          }}
        >
          Defina quais ações este perfil poderá executar em cada recurso.
        </Typography>

        {/* Recursos */}
        <Grid container spacing={2}>
          {perfilRecurso.map((item, index) => {
            const recurso = listRecurso.find(
              (r) => r.id === item.recursoId,
            );

            return (
              <Grid
                key={item.recursoId}
                size={{
                  xs: 12,
                  lg: 6,
                }}
              >
                <Controller
                  name={`perfilRecurso.${index}.permissaoIds`}
                  control={control}
                  render={({ field }) => {
                    const selected = Array.isArray(field.value)
                      ? field.value
                      : [];

                    const allSelected =
                      listPermissao.length > 0 &&
                      listPermissao.every((permissao) =>
                        selected.includes(permissao.id),
                      );

                    const hasPermission =
                      selected.length > 0;

                    const handleSelectAll = (
                      checked: boolean,
                    ) => {
                      if (checked) {
                        field.onChange(
                          listPermissao.map(
                            (permissao) => permissao.id,
                          ),
                        );

                        return;
                      }

                      field.onChange([]);
                    };

                    return (
                      <Paper
                        variant="outlined"
                        sx={{
                          height: "100%",
                          borderRadius: `${theme.radius.md}px`,

                          borderColor: hasPermission
                            ? theme.color.primary
                            : theme.color.border,

                          backgroundColor: hasPermission
                            ? theme.color.primarySoft
                            : theme.color.surface,

                          overflow: "hidden",

                          transition:
                            "border-color 0.15s ease, background-color 0.15s ease",

                          "&:hover": {
                            borderColor:
                              theme.color.primaryLight,
                          },
                        }}
                      >
                        {/* Cabeçalho do recurso */}
                        <Box
                          sx={{
                            px: 2,
                            pt: 2,
                            pb: 1.5,

                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                color:
                                  theme.color
                                    .textPrimary,
                              }}
                            >
                              {recurso?.nome ??
                                item.recursoId}
                            </Typography>

                            {recurso?.descricao && (
                              <Typography
                                sx={{
                                  mt: 0.25,
                                  fontSize: "0.8rem",
                                  color:
                                    theme.color
                                      .textSecondary,
                                }}
                              >
                                {recurso.descricao}
                              </Typography>
                            )}
                          </Box>

                          <FormControlLabel
                            sx={{
                              m: 0,
                              flexShrink: 0,

                              "& .MuiFormControlLabel-label":
                              {
                                fontSize: "0.75rem",
                                color:
                                  theme.color
                                    .textSecondary,
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                checked={allSelected}
                                onChange={(
                                  _event,
                                  checked,
                                ) =>
                                  handleSelectAll(
                                    checked,
                                  )
                                }
                              />
                            }
                            label="Todas"
                          />
                        </Box>

                        <Divider />

                        {/* Permissões */}
                        <Box
                          sx={{
                            px: 2,
                            py: 1.5,

                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                          }}
                        >
                          {listPermissao.map(
                            (permissao) => {
                              const checked =
                                selected.includes(
                                  permissao.id,
                                );

                              return (
                                <Box
                                  key={permissao.id}
                                  onClick={() => {
                                    if (checked) {
                                      field.onChange(
                                        selected.filter(
                                          (
                                            id: string,
                                          ) =>
                                            id !==
                                            permissao.id,
                                        ),
                                      );

                                      return;
                                    }

                                    field.onChange([
                                      ...selected,
                                      permissao.id,
                                    ]);
                                  }}
                                  sx={{
                                    minHeight: 36,
                                    px: 1.25,

                                    display: "flex",
                                    alignItems:
                                      "center",

                                    borderRadius: `${theme.radius.sm}px`,
                                    border: `1px solid ${checked
                                        ? theme.color
                                          .primary
                                        : theme.color
                                          .border
                                      }`,

                                    backgroundColor:
                                      checked
                                        ? theme.color
                                          .primaryLight
                                        : theme.color
                                          .surface,

                                    cursor: "pointer",

                                    transition:
                                      "all 0.15s ease",

                                    "&:hover": {
                                      borderColor:
                                        theme.color
                                          .primary,
                                      backgroundColor:
                                        theme.color
                                          .primarySoft,
                                    },
                                  }}
                                >
                                  <Checkbox
                                    size="small"
                                    checked={checked}
                                    tabIndex={-1}
                                    disableRipple
                                    sx={{
                                      p: 0,
                                      mr: 0.75,

                                      color:
                                        theme.color
                                          .textMuted,

                                      "&.Mui-checked":
                                      {
                                        color:
                                          theme.color
                                            .primary,
                                      },
                                    }}
                                  />

                                  <Typography
                                    sx={{
                                      fontSize:
                                        "0.825rem",
                                      fontWeight:
                                        checked
                                          ? 600
                                          : 500,
                                      color:
                                        theme.color
                                          .textPrimary,
                                    }}
                                  >
                                    {
                                      permissao.nome
                                    }
                                  </Typography>
                                </Box>
                              );
                            },
                          )}
                        </Box>
                      </Paper>
                    );
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </FormComponent>
  );
}
