import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  perfilFormDefaultValues,
  perfilFormSchema,
  PerfilFormSchema,
} from '@/schemas/perfilSchema';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/router';
import { useApiPerfil } from '@/hooks/api';
import { IRecursoResponse } from '@/hooks/api/recurso/useApiRecurso';
import { IPermissaoResponse } from '@/hooks/api/permissao/useApiPermissao';
import { useApiRecurso, useApiPermissao } from '@/hooks/api';

type PerfilRecursoMap = Record<string, string[]>;

export default function useFormPerfil() {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = useForm<PerfilFormSchema>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: perfilFormDefaultValues,
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listRecurso, setListRecurso] = useState<IRecursoResponse[]>([]);
  const [listPermissao, setListPermissao] = useState<IPermissaoResponse[]>([]);
  const { showToast } = useToast();
  const { query } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { getById, create, update } = useApiPerfil();
  const { list: listRecursosApi } = useApiRecurso();
  const { list: listPermissoesApi } = useApiPermissao();

  const perfilRecurso = watch('perfilRecurso');

  useEffect(() => {
    buscarRecursosEPermissoes();
    if (query.id) {
      buscar(String(query.id));
    }
  }, [query.id]);

  const mapToArray = (perfilMap: PerfilRecursoMap, recursos?: IRecursoResponse[]) => {
    if (recursos && recursos.length > 0) {
      return recursos.map((recurso) => ({
        recursoId: recurso.id,
        permissaoIds: perfilMap[recurso.id] || [],
      }));
    }

    return Object.entries(perfilMap).map(([recursoId, permissaoIds]) => ({
      recursoId,
      permissaoIds: permissaoIds || [],
    }));
  };

  const perfilRecursoToMap = (perfilRecurso?: Array<{ recurso?: { id?: string }; permissoes?: Array<{ id?: string }> }>): PerfilRecursoMap => {
    const map: PerfilRecursoMap = {};

    (perfilRecurso || []).forEach((item) => {
      const recursoId = item.recurso?.id;
      if (!recursoId) return;

      map[recursoId] = (item.permissoes || [])
        .map((p) => p.id)
        .filter((id): id is string => !!id);
    });

    return map;
  };

  const garantirLinhasRecursos = (recursos: IRecursoResponse[]) => {
    const atuais = getValues('perfilRecurso') || [];
    const merged = recursos.map((recurso) => {
      const atual = atuais.find((item) => item.recursoId === recurso.id);
      return {
        recursoId: recurso.id,
        permissaoIds: atual?.permissaoIds || [],
      };
    });
    setValue('perfilRecurso', merged, { shouldDirty: false });
  };

  const buscarRecursosEPermissoes = async () => {
    try {
      const [resRecursos, resPermissoes] = await Promise.all([
        listRecursosApi(),
        listPermissoesApi(),
      ]);

      const recursos = resRecursos.success ? resRecursos.data || [] : [];
      const permissoes = resPermissoes.success ? resPermissoes.data || [] : [];

      setListRecurso(recursos);
      setListPermissao(permissoes);

      if (recursos.length > 0) {
        garantirLinhasRecursos(recursos);
      }
    } catch (error) {
      console.error('Erro ao buscar recursos/permissões', error);
    }
  };

  const buscar = async (id: string) => {
    setLoading(true);
    try {
      const response = await getById(id);
      if (!response || !response.success || !response.data) {
        console.error('Erro ao buscar perfil', response);
        return;
      }

      const perfilMap = response.data.perfilRecurso || perfilRecursoToMap(response.data.perfilRecursoResponse?.map((pr) => ({
        recurso: { id: pr.recursoId },
        permissoes: pr.permissoes?.map((p) => ({ id: p.id })) || [],
      })));
      const recursosAtuais = listRecurso.length > 0 ? listRecurso : undefined;

      reset({
        nome: response.data.nome,
        descricao: response.data.descricao,
        ativo: !!response.data.ativo,
        perfilRecurso: mapToArray(perfilMap, recursosAtuais),
      });
    } catch (error) {
      showToast('Erro ao carregar os dados!', 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (data: PerfilFormSchema) => {
    setIsSubmitting(true);
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        ativo: data.ativo,
        perfilRecurso: data.perfilRecurso.reduce<PerfilRecursoMap>((acc, item) => {
          acc[item.recursoId] = item.permissaoIds || [];
          return acc;
        }, {}),
      };

      if (query.id) {
        await update(String(query.id), payload);
      } else {
        await create(payload);
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
      listRecurso,
      listPermissao,
      perfilRecurso,
    },
  };
}
