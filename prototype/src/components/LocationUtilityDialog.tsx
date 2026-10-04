import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  label: string;
  kind: "qr" | "artifact" | "panorama";
  onClose: () => void;
  children: ReactNode;
}

export function LocationUtilityDialog({ label, kind, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="heritage-utility-dialog"
      data-location-overlay={kind}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {children}
    </dialog>
  );
}
