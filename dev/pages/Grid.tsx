import { Grid, GridElement, type GridDataProvider } from '../../packages/react-components/src/Grid.js';
import { GridSelectionColumn } from '../../packages/react-components/src/GridSelectionColumn.js';
import { GridTreeColumn } from '../../packages/react-components/src/GridTreeColumn.js';
import { GridColumn, GridColumnElement } from '../../packages/react-components/src/GridColumn.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { GridBodyReactRendererProps } from '@vaadin/react-components/renderers/grid.d.ts';

type Item = { name: string };

const items: Item[] = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` }));

const GridContext = createContext<{ title: string } | null>(null);

function GridColumnContent({ item }: GridBodyReactRendererProps<Item>) {
  const gridContext = useContext(GridContext)!;
  return <>{gridContext.title}: {item.name}</>;
}

export default function () {
  const [count, setCount] = useState(0);

  return <>
    <GridContext.Provider value={{ title: 'Grid' }}>
      <Grid<Item> items={items}>
        <GridColumn>
          {({ item }) => <input />}
        </GridColumn>
      </Grid>
    </GridContext.Provider>

    <button onClick={() => setCount(count + 1)}>Update</button>
  </>;
}
