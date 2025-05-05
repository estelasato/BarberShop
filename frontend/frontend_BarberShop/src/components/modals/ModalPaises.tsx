import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { atualizarPais, criarPais, UpdatePaisDto } from "@/services/paisService";

export interface IFormModalRef {
    open: (data?: any) => void;
    close: () => void;
}

interface IModalPaises {
    carregarPaises?:  ()  =>  void
}

interface IPais {
    nome?: string,
    sigla?: string,
    ddi?: string
    id?: number,
    dataCriacao?: string,
    dataAtualizacao?:  string
}

export const ModalPaises = forwardRef<IFormModalRef, IModalPaises>(({carregarPaises}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<IPais>({
        nome: '',
        sigla: '',
        ddi: '',
        id: undefined,
        dataCriacao: '',
        dataAtualizacao:  ''
    })

    useImperativeHandle(
        ref,
        () => ({
            open: (data) => {
                console.log(data)
                data && setFormData(data)
                setIsOpen(true);
            },
            close: () => {
                setIsOpen(false);
            },
        }),
        [setIsOpen]
    );

      async function handleSubmit() {
        try {
          if (!!formData && formData.id) {
            await atualizarPais(formData.id, formData as  UpdatePaisDto)
          } else {
            await criarPais(formData as UpdatePaisDto)
          }
          setIsOpen(false)
          carregarPaises &&  await carregarPaises()
        } catch (err) {
          console.error("Erro ao salvar país:", err)
        }
      }
    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[60%]  sm:max-w-[95%]">
                <DialogHeader>
                    <DialogTitle>{!!formData ? "Editar País" : "Novo País"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <Input
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Sigla</label>
                        <Input
                            value={formData.sigla}
                            maxLength={2}
                            onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">DDI</label>
                        <Input
                            value={formData.ddi}
                            onChange={(e) => setFormData({ ...formData, ddi: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>
                        {!!formData ? "Atualizar" : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})