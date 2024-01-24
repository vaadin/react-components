import { GridPro, GridProEditColumn } from '@vaadin/react-components-pro';
import { TextField } from '@vaadin/react-components';

type Item = {
  firstName: string;
  lastName: string;
  title: 'mr' | 'mrs' | 'ms';
  married: boolean;
};

const users: Item[] = [...Array(1000)].map((_, i) => {
  return {
    firstName: `First Name ${i}`,
    lastName: `Last Name ${i}`,
    title: 'mr',
    married: true,
  };
});

export default function () {
  return (
    <GridPro singleCellEdit items={users}>
      <GridProEditColumn path="firstName" />
      <GridProEditColumn
        path="lastName"
        editModeRenderer={() => <TextField />}
        renderer={({ item }) => <span>{item.lastName}</span>}
      />
      <GridProEditColumn path="title" editorType="select" editorOptions={['mr', 'mrs', 'ms']} />
      <GridProEditColumn path="married" editorType="checkbox" />
    </GridPro>
  );
}
