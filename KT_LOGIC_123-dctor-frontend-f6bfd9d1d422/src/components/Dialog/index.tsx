import React, { ReactNode } from "react";

export default function Modal({ render }: { render : ReactNode}) {
  return (
    <dialog>
      {render}
    </dialog>
  );
}
