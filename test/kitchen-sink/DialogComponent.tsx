import { PropsWithChildren, useState } from "react";
import { Button } from "../../src/Button.js";
import { Dialog } from "../../src/Dialog.js";

export type DialogComponentProps = Readonly<{
  opened: boolean;
  close: () => void;
}>;

export function DialogComponent({ opened, close }: PropsWithChildren<DialogComponentProps>) {
  const [count, setCount] = useState(0);

  return (
    <Dialog
      opened={opened}
      header={<div>HEADER</div>}
      footer={
        <>
          <Button onClick={() => setCount(count + 1)}>Increase count</Button>
          <Button onClick={close}>Close</Button>
        </>
      }
    >
      <div>BODY count: {count}</div>
    </Dialog>
  );
}
