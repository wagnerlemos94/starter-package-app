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
    formState: { errors },
  } = useForm<UsuarioFormSchema>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: usuarioFormDefaultValues,
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listPerfil, setListPerfil] = useState<IPerfilResponse[]>([]);
  const { showToast } = useToast();
  const { query } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { getById, create, update } = useApiUsuario();
  const { list: listPerfilApi } = useApiPerfil();

  useEffect(() => {
    buscarPerfis();
    if (query.id) {
      buscar(String(query.id));
    }
  }, [query.id]);

  const buscarPerfis = async () => {
    try {
      const response = await listPerfilApi();
      if (response && response.success) {
        setListPerfil(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar perfis', error);
    }
  };

  const buscar = async (id: string) => {
    setLoading(true);
    try {
      const response = await getById(id);
      if (!response || !response.success || !response.data) {
        console.error('Erro ao buscar usuário', response);
        return;
      }

      reset({
        cpf: response.data.cpf,
        name: response.data.name,
        profileId: response.data.profile?.id ?? '',
        active: !!response.data.active,
      });
    } catch (error) {
      showToast('Erro ao carregar os dados!', 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (data: UsuarioFormSchema) => {
    setIsSubmitting(true);
    try {
      if (query.id) {
        await update(String(query.id), data);
      } else {
        await create(data);
      }
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
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
