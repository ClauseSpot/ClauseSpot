"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutationAddFiles } from "@/app/hooks/mutations/useMutateAddFiles";

const addArquivoSchema = z.object({
  nome: z.string(),
  file: z.instanceof(File)
});

type addArquivoFormType = z.infer<typeof addArquivoSchema>;

interface AddArquivoFormProps {
  children: React.ReactNode;
  setPendent: (pendent: boolean) => void;
  closeDialog: () => void;
}

export const FormAdicionarArquivo: React.FC<AddArquivoFormProps> = ({
  children,
  setPendent,
  closeDialog,
}) => {
  const router = useRouter();
  const userId = 1;

  const AddArquivoForm = useForm<addArquivoFormType>({
    resolver: zodResolver(addArquivoSchema)
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = AddArquivoForm;

  const { mutateAsync, isPending, isSuccess } = useMutationAddFiles()

  const handleFormSubmit = async (data: addArquivoFormType) => {
    try {
      const formData = new FormData();
      formData.append("usuario_id", String(userId));
      formData.append("file", data.file);
      formData.append("nome", data.nome);
      mutateAsync(formData)

    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar arquivo");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      closeDialog()
    }
  }, [isSuccess])

  return (
    <Form {...AddArquivoForm}>
      <form
        onSubmit={AddArquivoForm.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-2 max-h-[80vh] overflow-y-auto gap-x-4 gap-y-2 p-4"
      >
        <FormField
          control={AddArquivoForm.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Arquivo</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={AddArquivoForm.control}
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
                    if (file) {
                      field.onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col col-span-2 mt-5 mb-5 " />

        <div className="col col-span-2 mt-10">
          <Button type="submit" disabled={isPending}> Salvar </Button>
        </div>
      </form>
    </Form>
  );
};
