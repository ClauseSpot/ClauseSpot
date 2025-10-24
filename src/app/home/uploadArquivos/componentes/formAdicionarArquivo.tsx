import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const addArquivoSchema = z.object({
  nome: z.string(),
  data_registro: z.string(),
  file: z.instanceof(File) // agora esperamos o arquivo direto
});

type addArquivoFormType = z.infer<typeof addArquivoSchema>;

interface AddArquivoFormProps {
  children: React.ReactNode;
  setPendent: (pendent: boolean) => void;
  closeDialog: () => void;
  listaArquivos: any[];
  setListaArquivos: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FormAdicionarArquivo: React.FC<AddArquivoFormProps> = ({
  children,
  setPendent,
  closeDialog,
  listaArquivos,
  setListaArquivos
}) => {
  const router = useRouter();
  const userId = 1;

  const AddArquivoForm = useForm<addArquivoFormType>({
    resolver: zodResolver(addArquivoSchema)
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = AddArquivoForm;

  const handleFormSubmit = async (data: addArquivoFormType) => {
    try {
      const formData = new FormData();
      formData.append("usuario_id", String(userId));
      formData.append("file", data.file); // arquivo enviado como multipart
      formData.append("nome", data.nome);
      formData.append("data_registro", data.data_registro);

      console.log("Data: ", data)
      console.log("FormData: ", formData)

      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData
      });

      console.log("Response: ", response)

      if (!response.ok) throw new Error("Erro ao enviar arquivo");

      const result = await response.json();

      console.log("Result: ", result)

      toast.success("Arquivo enviado com sucesso!");
      setListaArquivos(prev => [...prev, result]);
      closeDialog();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar arquivo");
    }
  };

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
          name="data_registro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Registro</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
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
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};
