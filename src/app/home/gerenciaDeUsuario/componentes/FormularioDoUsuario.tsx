"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🔹 Schema base de validação
const baseSchema = z.object({
  usuario: z.string().min(3, { message: "Usuário deve ter no mínimo 3 caracteres." }),
  nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  status: z.enum(["Ativo", "Inativo"]),
  cargo: z.enum(["Gestor", "Curador", "Usuário"]).nullable(), 
});

const createUserSchema = baseSchema.extend({
  senha: z.string().min(6, { message: "A senha precisa ter no mínimo 6 caracteres." }),
});

const editUserSchema = baseSchema.extend({
  senha: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Se preenchida, a senha deve ter no mínimo 6 caracteres.",
    }),
});

export type DadosDoFormulario = z.infer<typeof baseSchema> & {
  senha?: string;
};

interface PropsFormDeUsuario {
  initialData?: DadosDoFormulario | null;
  onSave: (data: DadosDoFormulario) => Promise<void>; 
  onCancel: () => void;
}

export const FormularioDoUsuario = ({
  initialData,
  onSave,
  onCancel,
}: PropsFormDeUsuario) => {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DadosDoFormulario>({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: initialData || {
      usuario: "",
      nome: "",
      email: "",
      status: "Ativo",
      senha: "",
      cargo: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        senha: "",
        cargo: initialData.cargo || null,
      });
    } else {
      form.reset({
        usuario: "",
        nome: "",
        email: "",
        status: "Ativo",
        senha: "",
        cargo: null,
      });
    }
  }, [initialData, form.reset]);

  const onSubmit = async (data: DadosDoFormulario) => {
    setIsSubmitting(true);
    try {
      await onSave(data); 
    } catch (error) {
      console.error("Erro no submit:", error);
      toast.error("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ana.silva" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ana Silva" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ex: ana.silva@example.com" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Gestor">Gestor</SelectItem>
                  <SelectItem value="Curador">Curador</SelectItem>
                  <SelectItem value="Usuário">Usuário</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditing ? "Deixe em branco para não alterar" : "********"}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: "#2c5582" }}
            className="text-white hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
};