"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"; // ✅ Importa o hook correto
import { useMutationAddFiles } from "@/app/hooks/mutations/useMutateAddFiles";

const addArquivoSchema = z.object({
  nome: z.string().min(1, "O nome do arquivo é obrigatório."),
  file: z.instanceof(File, { message: "Selecione um arquivo válido." }),
});

type AddArquivoFormType = z.infer<typeof addArquivoSchema>;

interface AddArquivoFormProps {
  setPendent: (pendent: boolean) => void;
  closeDialog: () => void;
}

export const FormAdicionarArquivo: React.FC<AddArquivoFormProps> = ({
  setPendent,
  closeDialog,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}" ).id;

  const form = useForm<AddArquivoFormType>({
    resolver: zodResolver(addArquivoSchema),
  });

  const { mutateAsync, isPending, isSuccess } = useMutationAddFiles();

  const handleFormSubmit = async (data: AddArquivoFormType) => {
    try {
      const formData = new FormData();
      formData.append("usuario_id", String(userId));
      formData.append("file", data.file);
      formData.append("nome", data.nome);

      await mutateAsync(formData);

      toast({
        title: "📁 Arquivo enviado com sucesso!",
        description: `O arquivo "${data.nome}" foi salvo e está disponível.`,
      });

      form.reset();
      closeDialog();
      router.refresh(); // Atualiza a tela automaticamente
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "❌ Erro ao enviar arquivo",
        description: "Não foi possível salvar o arquivo. Tente novamente.",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setPendent(false);
    }
  }, [isSuccess]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-2 max-h-[80vh] overflow-y-auto gap-x-4 gap-y-2 p-4"
      >

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Arquivo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite o nome do arquivo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    const maxSize = 3 * 1024 * 1024
                    if (file) {
                      if (file.size > maxSize) {
                        alert("O arquivo excede o tamanho máximo permitido de 3MB.");
                        e.target.value = ""
                        return;
                      } else {
                        field.onChange(file);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2 mt-5 mb-5" />

        <div className="col-span-2 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
