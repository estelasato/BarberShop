import { forwardRef, useImperativeHandle, useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { IFormModalRef } from "./ModalPaises";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

interface IModalConfirm {
    title: string,
    description: string,
    onConfirm: () => void

}
export const ModalConfirm = forwardRef<IFormModalRef, IModalConfirm>(({ title, description, onConfirm }, ref) => {
    const [isOpen, setIsOpen] = useState(false);


    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                setIsOpen(true);
            },
            close: () => {
                setIsOpen(false);
            },
        }),
        [setIsOpen]
    );

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                    {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onConfirm()}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
})