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

type ProfilesResourceMap = Record<string, string[]>;

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

  const profilesResource = watch('profilesResource');

  useEffect(() => {
    buscarRecursosEPermissoes();
    if (query.id) {
      buscar(String(query.id));
    }
  }, [query.id]);

  const mapToArray = (profilesMap: ProfilesResourceMap, recursos?: IRecursoResponse[]) => {
    if (recursos && recursos.length > 0) {
      return recursos.map((recurso) => ({
        resourceId: recurso.id,
        permissionIds: profilesMap[recurso.id] || [],
      }));
    }

    return Object.entries(profilesMap).map(([resourceId, permissionIds]) => ({
      resourceId,
      permissionIds: permissionIds || [],
    }));
  };

  const profileResourcesToMap = (profileResources?: Array<{ resource?: { id?: string }; permissions?: Array<{ id?: string }> }>): ProfilesResourceMap => {
    const map: ProfilesResourceMap = {};

    (profileResources || []).forEach((item) => {
      const resourceId = item.resource?.id;
      if (!resourceId) return;

      map[resourceId] = (item.permissions || [])
        .map((p) => p.id)
        .filter((id): id is string => !!id);
    });

    return map;
  };

  const garantirLinhasRecursos = (recursos: IRecursoResponse[]) => {
    const atuais = getValues('profilesResource') || [];
    const merged = recursos.map((recurso) => {
      const atual = atuais.find((item) => item.resourceId === recurso.id);
      return {
        resourceId: recurso.id,
        permissionIds: atual?.permissionIds || [],
      };
    });
    setValue('profilesResource', merged, { shouldDirty: false });
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

      const profilesMap = response.data.profilesResource || profileResourcesToMap(response.data.profileResourceResponse?.map((pr) => ({
        resource: { id: pr.resourceId },
        permissions: pr.permission?.map((p) => ({ id: p.id })) || [],
      })));
      const recursosAtuais = listRecurso.length > 0 ? listRecurso : undefined;

      reset({
        name: response.data.name,
        description: response.data.description,
        active: !!response.data.active,
        profilesResource: mapToArray(profilesMap, recursosAtuais),
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
        name: data.name,
        description: data.description,
        active: data.active,
        profilesResource: data.profilesResource.reduce<ProfilesResourceMap>((acc, item) => {
          acc[item.resourceId] = item.permissionIds || [];
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
      profilesResource,
    },
  };
}
