import FormComponent from '@/components/FormComponent';
import useFormUsuario from './useFormUsuario';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TextFieldMask from '@/components/TextFieldMask';
import SelectComponet from '@/components/SelectComponet';
import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function FormUsuario() {
    const {
        action: { salvar, register },
        data: { isSubmitting, errors, control, loading, listPerfil },
    } = useFormUsuario();

    return (
        <>
            <FormComponent
                onSubmit={salvar}
                titulo="Formulário de Cadastro Usuário"
                isSubmitting={isSubmitting || loading}
            >
                <Box
                    sx={{
                        m: 1,
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ width: '32%', display: 'flex', m: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...register("name")}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    label="Nome"
                                    fullWidth
                                    focused={true}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ width: '20%', m: 1, display: 'flex' }}>
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
                                    focused={true}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ width: '32%', display: 'flex', m: 1 }}>
                        <Controller
                            name="profileId"
                            control={control}
                            render={({ field }) => (
                                <SelectComponet
                                    name="Perfil"
                                    options={listPerfil.map((item) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    error={!!errors.profileId}
                                    helperText={errors.profileId?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ width: '10%', display: 'flex', m: 1, alignItems: 'center' }}>
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!field.value}
                                            onChange={(_e, checked) => field.onChange(checked)}
                                            color="success"
                                        />
                                    }
                                    label="Ativo"
                                />
                            )}
                        />
                    </Box>
                </Box>
            </FormComponent>
        </>
    );
}
