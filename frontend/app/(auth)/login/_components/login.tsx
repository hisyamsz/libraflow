"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import FormPassword from "@/components/common/form-password";
import { LoginForm, loginSchemaForm } from "@/validations/auth.validation";
import { INITIAL_AUTH_LOGIN_FORM } from "@/constants/auth.contants";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_AUTH_LOGIN_FORM,
  });

  const loginService = async (payload: LoginForm) => {
    const result = await signIn("credentials", {
      ...payload,
      redirect: false,
      callbackUrl,
    });

    if (!result || !result.ok) {
      throw new Error(result?.error || "NIS / Email atau Password salah");
    }

    return result;
  };

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: loginService,
    onError: (error) => {
      toast.error("Login gagal", {
        description: error.message,
      });
      form.setError("root", { message: error.message });
    },
    onSuccess: () => {
      toast.success("Login berhasil");
      router.push(callbackUrl);
      form.reset();
    },
  });

  const onSubmit = (data: LoginForm) => {
    form.clearErrors("root");
    mutateLogin(data);
  };

  return (
    <Card className="py-6 shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Login untuk mengakses sistem perpustakaan
        </CardDescription>
      </CardHeader>

      <CardContent className="md:px-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldSet>
            <FieldGroup>
              <FormInput
                form={form}
                name="identifier"
                label="NIS / Email"
                placeholder="Masukkan nis atau email"
                autoFocus
                disabled={isPendingLogin}
              />

              <FormPassword
                form={form}
                name="password"
                label="Password"
                disabled={isPendingLogin}
              />
            </FieldGroup>
          </FieldSet>

          {form.formState.errors.root && (
            <p className="text-center text-sm text-red-500 dark:text-red-400">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPendingLogin}>
            {isPendingLogin ? (
              <>
                <Spinner />
                Logging in..
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
