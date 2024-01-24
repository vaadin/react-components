import { Button, Tooltip } from '@vaadin/react-components';

export default function () {
  return (
    <Button>
      Edit
      <Tooltip slot="tooltip" text="Click to edit" />
    </Button>
  );
}
