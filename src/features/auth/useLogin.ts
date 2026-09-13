import { useToast } from "@/components/Toast";
import { loginDefaultValues, loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useLogin = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues,
    });

    const logout = async () => {
        try {
            await signOut({ callbackUrl: '/login' });
        } catch {
            showToast("Não foi possível encerrar a sessão.", "error");
        }
    };

    const login = async (data: LoginSchema) => {
        try {
            setIsSubmitting(true);
            const res = await signIn("credentials", {
                redirect: false,
                cpf: data.cpf,
                senha: data.senha,
            });

            if (res?.error) {
                showToast("Usuário ou senha incorretos.", "error");
                return;
            }
            await router.push("/");
        } catch {
            showToast("Erro ao Logar. Tente novamente.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        action: {
            login: handleSubmit(login),
            register,
            setIsVisible,
            logout,
        },
        data: {
            isSubmitting,
            isVisible,
            errors,
            control
        }
    };
}
