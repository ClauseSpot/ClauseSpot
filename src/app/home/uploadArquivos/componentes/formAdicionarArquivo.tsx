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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  categoria: z.string().min(1, "Selecione uma categoria."),
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
      formData.append("apelido_arquivo", data.nome);
      formData.append("categoria", data.categoria);

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

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white focus:ring-[#1A365D]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contrato">Contrato</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="regulamento">Regulamento</SelectItem>
                  <SelectItem value="prova">Prova</SelectItem>
                  <SelectItem value="anexo">Anexo</SelectItem>
                </SelectContent>
              </Select>
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
