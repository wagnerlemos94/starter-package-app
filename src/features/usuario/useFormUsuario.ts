import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  usuarioFormDefaultValues,
  usuarioFormSchema,
  UsuarioFormSchema,
} from '@/schemas/usuarioSchema';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/router';
import { useApiUsuario } from '@/hooks/api';
import { IPerfilResponse } from '@/hooks/api/perfil/useApiPerfil';
import { useApiPerfil } from '@/hooks/api';

export default function useFormUsuario() {
  const {
    handleSubmit,
    control,
    reset,
    register,
    setError,
    formState: { errors },
  } = useForm<UsuarioFormSchema>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: usuarioFormDefaultValues,
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listPerfil, setListPerfil] = useState<IPerfilResponse[]>([]);
  const { showToast } = useToast();
  const router = useRouter();
  const { query } = router;
  const [loading, setLoading] = useState<boolean>(false);
  const { getById, create, update } = useApiUsuario();
  const { list: listPerfilApi } = useApiPerfil();

  const buscarPerfis = async () => {
    try {
      const response = await listPerfilApi();
      if (response && response.success) {
        setListPerfil(response.data || []);
      }
    } catch {
      showToast('Erro ao buscar perfis', 'error');
    }
  };

  const buscar = async (id: string) => {
    setLoading(true);
    try {
      const response = await getById(id);
      if (!response || !response.success || !response.data) {
        showToast('Erro ao carregar os dados!', 'error');
        return;
      }

      reset({
        cpf: response.data.cpf,
        name: response.data.name,
        profileId: response.data.profile?.id ?? '',
        password: '',
        active: !!response.data.active,
      });
    } catch {
      showToast('Erro ao carregar os dados!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void buscarPerfis();
    if (query.id) {
      void buscar(String(query.id));
    }
    // As funções de carga são executadas somente quando o identificador da rota muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id]);

  const salvar = async (data: UsuarioFormSchema) => {
    if (!query.id && !data.password) {
      setError('password', {
        type: 'manual',
        message: 'Senha é obrigatória no cadastro',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        password: data.password || undefined,
      };
      const response = query.id
        ? await update(String(query.id), payload)
        : await create(payload);

      if (!response.success) {
        response.errors.forEach(({ field, message }) => {
          if (field in usuarioFormDefaultValues) {
            setError(field as keyof UsuarioFormSchema, {
              type: 'server',
              message,
            });
          }
        });
        return;
      }

      await router.push('/usuario');
    } catch {
      showToast('Erro ao salvar formulário. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    action: {
      salvar: handleSubmit(salvar),
      register,
    },
    data: {
      errors,
      control,
      loading,
      isSubmitting,
      listPerfil,
    },
  };
}
