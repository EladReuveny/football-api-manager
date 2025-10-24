import React, { type ReactNode } from "react";

type FormDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children: ReactNode;
};

const FormDialog = ({
  dialogRef,
  title,
  onClose,
  onSubmit,
  children,
}: FormDialogProps) => {
  return (
    <dialog
      ref={dialogRef}
      className="w-1/2 top-1/2 left-1/2 -translate-1/2 bg-(--color-bg) text-(--color-text) py-4 px-2 backdrop:backdrop-brightness-25 backdrop:backdrop-blur-md"
    >
      <button
        type="button"
        title="Close"
        onClick={onClose}
        className="absolute top-0.5 right-0.5 text-sm text-gray-400 hover:brightness-150"
      >
        <i className="fas fa-times"></i>
      </button>
      <h2 className="text-2xl text-center font-semibold mb-4">{title}</h2>

      <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-3">
        {children}

        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded border border-gray-600 hover:backdrop-brightness-400"
          >
            <i className="fas fa-times mr-0.5"></i>Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 rounded bg-(--color-primary) hover:brightness-110"
          >
            <i className="fas fa-save mr-0.5"></i>Save
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default FormDialog;
