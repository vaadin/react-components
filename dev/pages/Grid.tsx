import {
  Grid,
  type GridDataProvider,
  GridSelectionColumn,
  GridTreeColumn,
  GridColumn,
  GridColumnElement,
  Tooltip,
} from '@vaadin/react-components';

type Item = {
  name: string;
  children: boolean;
};

const dataProvider: GridDataProvider<Item> = ({ parentItem, page, pageSize }, cb) => {
  const levelSize = parentItem ? 5 : 100;

  const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
    const indexInLevel = page * pageSize + i;

    return {
      name: `${parentItem ? parentItem.name + '-' : ''}${indexInLevel}`,
      children: true,
    };
  });

  cb(pageItems, levelSize);
};

const tooltipGenerator = ({ column, item }: Record<string, unknown>) => {
  const columnPath = (column as GridColumnElement)?.path;
  const itemName = (item as Item)?.name;
  return columnPath && itemName ? `Tooltip ${columnPath} ${itemName}` : '';
};

export default function () {
  return (
    <Grid itemIdPath="name" dataProvider={dataProvider}>
      <GridSelectionColumn frozen autoSelect dragSelect />
      <GridTreeColumn frozen path="name" width="200px" />
      <GridColumn path="name" width="200px" />
      <GridColumn path="name" width="200px" />
      <GridColumn path="name" width="200px" />

      <Tooltip slot="tooltip" hoverDelay={500} hideDelay={500} generator={tooltipGenerator} />
    </Grid>
  );
}
