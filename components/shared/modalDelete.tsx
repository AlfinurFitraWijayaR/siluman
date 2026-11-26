import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  entityName: string;
  itemName: string;
}

export const ModalDelete = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  entityName,
  itemName,
}: ModalDeleteProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-[#dedfd6] overflow-hidden p-6 space-y-4 animate-in fade-in-0 zoom-in-95 text-center"
      >
        <div>
          <h3 className="text-base font-semibold text-[#171717]">
            Konfirmasi Hapus {entityName}
          </h3>
          <p className="text-xs text-[#555555] mt-1.5">
            Apakah Anda yakin ingin menghapus data {entityName.toLowerCase()}{" "}
            <strong className="text-[#171717]">{itemName}</strong>? Tindakan ini
            tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer px-4 h-9 text-xs text-[#555555]"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="cursor-pointer flex items-center text-xs"
          >
            <Trash2 className="w-4 h-4" />
            {isSubmitting ? "Menghapus..." : `Hapus ${entityName}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
