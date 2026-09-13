import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
  const router = useRouter();
  const { query } = router;
  const [loading, setLoading] = useState<boolean>(false);
  const { getById, create, update } = useApiPerfil();
  const { list: listRecursosApi } = useApiRecurso();
  const { list: listPermissoesApi } = useApiPermissao();

  const perfilRecurso = useWatch({ control, name: 'perfilRecurso' });

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
    } catch {
      showToast('Erro ao buscar recursos e permissões', 'error');
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
    } catch {
      showToast('Erro ao carregar os dados!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void buscarRecursosEPermissoes();
    if (query.id) {
      void buscar(String(query.id));
    }
    // As funções de carga são executadas somente quando o identificador da rota muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id]);

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

      const response = query.id
        ? await update(String(query.id), payload)
        : await create(payload);

      if (response.success) {
        await router.push('/perfil');
      }
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
      listRecurso,
      listPermissao,
      perfilRecurso,
    },
  };
}
