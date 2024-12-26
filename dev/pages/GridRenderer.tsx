import { Grid } from '../../packages/react-components/src/Grid.js';
import { GridColumn } from '../../packages/react-components/src/GridColumn.js';
import React, { useState } from 'react';
import { createRendererCallback } from '../../packages/react-components/src/renderers/renderer.js';
import type { GridBodyReactRendererProps } from '../../packages/react-components/src/renderers/grid.js';

type Item = { name: string };

const items: Item[] = [...Array(100)].map((_, i) => ({ name: `Item ${i}` }));

class ComponentClass extends React.Component<GridBodyReactRendererProps<Item>> {
  override state = { count: 0 };

  override render() {
    return <>
      <input onInput={() => this.setState({ count: this.state.count + 1 })}/> {this.props.item.name} | {this.state.count}
    </>;
  }
}

function ComponentFunction(props: { item: Item }) {
  const [count, setCount] = useState(0);
  return <>
    <input onInput={() => setCount(count + 1)}/> {props.item.name} | {count}
  </>
}

export default function () {
  const [count, setCount] = useState(0);

  return <>
    <Grid<Item> itemIdPath="name" items={items}>
      <GridColumn<Item> header="ComponentClass">
        {ComponentClass}
      </GridColumn>

      <GridColumn<Item> header="ComponentFunction">
        {ComponentFunction}
      </GridColumn>

      <GridColumn<Item> header="ComponentFunction in callback">
        {({ item }) => <ComponentFunction item={item} />}
      </GridColumn>

      <GridColumn<Item> header="ComponentFunction in renderer callback">
        {createRendererCallback(({ item }) => <ComponentFunction item={item} />)}
      </GridColumn>
    </Grid>

    <button onClick={() => setCount(count + 1)}>Re-render</button>
  </>;
}
