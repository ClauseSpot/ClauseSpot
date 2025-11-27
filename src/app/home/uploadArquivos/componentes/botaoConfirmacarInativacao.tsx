"use client";

import { useMutationDeactivateFile } from "@/app/hooks/mutations/useMutateDeactivateFiles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Ban, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  fileId: number | string;
}

export function BotaoConfirmarInativacao({ fileId }: Props) {
  const [open, setOpen] = useState(false)

  const { mutateAsync, isPending, isSuccess} = useMutationDeactivateFile();

  const handleSuccess = () => {
    setOpen(false);
  };

  const deactivateFile = async () => {
    await mutateAsync(Number(fileId));
  }

  useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [isSuccess])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button
                className="w-full bg-[#5d1a1a] hover:bg-[#b02b2b] text-white"
                >
                Inativar Arquivo
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg">

            <AlertDialogHeader>
            <AlertDialogTitle>
                Confirmar Inativação?
            </AlertDialogTitle>
            <AlertDialogDescription>
                O arquivo não estará mais disponível para análise. 
                Tem certeza que deseja inativar este arquivo?
            </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="w-full flex justify-center">
            <AlertDialogAction asChild>
                <Button
                    onClick={deactivateFile}
                    disabled={isPending}
                    className="bg-[#d83b3b] hover:bg-[#b02b2b] text-white"
                    >
                    {!isPending ? "Inativar Arquivo" : "Inativando arquivo..."}
                </Button>
            </AlertDialogAction>
            </div>

            <AlertDialogFooter className="mt-0">
                <AlertDialogCancel className="mx-auto">
                    Sair
                </AlertDialogCancel>
            </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
