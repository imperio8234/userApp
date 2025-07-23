import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ConfirmationPopoverProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const ConfirmationPopover: React.FC<ConfirmationPopoverProps> = ({
  message,
  onConfirm,
  onCancel,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = (e: any) => {
    e.stopPropagation();
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-gray-300">
        <p className="text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <button onClick={handleConfirm} className="hover:bg-gray-100">
            Confirmar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmationPopover;
