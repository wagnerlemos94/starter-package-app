import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/Toast';
import { useApiUsuario } from '@/hooks/api';
import { usuarioContaSchema, usuarioContaDefaultValues, UsuarioContaSchema } from '@/schemas/usuarioSchema';

export default function useFormMinhaConta() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<UsuarioContaSchema>({
    resolver: zodResolver(usuarioContaSchema),
    defaultValues: usuarioContaDefaultValues,
    mode: 'onChange',
  });
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCurrent, updateCurrent } = useApiUsuario();
  const { update: updateSession } = useSession();
  const { showToast } = useToast();

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const response = await getCurrent();
        if (!ativo || !response.success) return;
        setCpf(response.data.cpf);
        reset({ ...usuarioContaDefaultValues, nome: response.data.nome });
        setLoaded(true);
      } catch {
        if (ativo) showToast('Erro ao carregar sua conta', 'error');
      } finally {
        if (ativo) setLoading(false);
      }
    };
    void carregar();
    return () => { ativo = false; };
    // Carrega a própria conta uma vez ao abrir a página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salvar = async (data: UsuarioContaSchema) => {
    if (!loaded || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await updateCurrent({
        nome: data.nome,
        senha: data.senha || undefined,
        senhaAtual: data.senha ? data.senhaAtual : undefined,
      });
      if (!response.success) {
        response.errors.forEach(({ field, message }) => {
          if (field in usuarioContaDefaultValues) setError(field as keyof UsuarioContaSchema, { type: 'server', message });
        });
        return;
      }
      reset({ ...usuarioContaDefaultValues, nome: response.data.nome });
      showToast('Sua conta foi atualizada com sucesso', 'success');
      try {
        const session = await updateSession();
        if (session?.user.name !== response.data.nome) {
          showToast('Dados salvos. Atualize sua sessão para exibir o novo nome no menu.', 'info');
        }
      } catch {
        showToast('Dados salvos. Recarregue a página para atualizar o nome no menu.', 'info');
      }
    } catch {
      showToast('Erro ao atualizar sua conta', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    action: { salvar: handleSubmit(salvar), register },
    data: { cpf, errors, loading, loaded, isSubmitting },
  };
}
