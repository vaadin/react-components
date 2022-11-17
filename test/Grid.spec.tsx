import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Grid } from '../src/Grid.js';
import { GridColumn } from '../src/GridColumn.js';
import catchRender from './utils/catchRender.js';

function isGridCellContentNodeRendered(node: Node) {
  return (
    node instanceof Text &&
    node.parentNode instanceof HTMLElement &&
    node.parentNode.localName === 'vaadin-grid-cell-content'
  );
}

describe('Grid', () => {
  it('should render correctly', async () => {
    type Item = Readonly<{ name: string; surname: string; role: string }>;

    const items = [
      { name: 'John', surname: 'Lennon', role: 'singer' },
      { name: 'Ringo', surname: 'Starr', role: 'drums' },
    ];

    render(
      <Grid<Item> items={items}>
        <GridColumn<Item> headerRenderer={() => <>Name</>} footerRenderer={() => <>Name Footer</>}>
          {({ item }) => <>{item.name}</>}
        </GridColumn>
        <GridColumn<Item> headerRenderer={() => <>Surname</>} footerRenderer={() => <>Surname Footer</>}>
          {({ item }) => <>{item.surname}</>}
        </GridColumn>
        <GridColumn<Item> headerRenderer={() => <>Role</>} footerRenderer={() => <>Role Footer</>}>
          {({ item }) => <>{item.role}</>}
        </GridColumn>
      </Grid>,
    );

    const grid = document.querySelector('vaadin-grid');
    expect(grid).not.to.be.undefined;

    await catchRender(grid!, isGridCellContentNodeRendered);

    const columns = document.querySelectorAll('vaadin-grid-column');
    // Filter cells that don't have any textContent. Grid creates empty cells for some calculations,
    // but we don't need them.
    const cells = Array.from(
      grid!.querySelectorAll('vaadin-grid-cell-content'),
      ({ textContent }) => textContent,
    ).filter(Boolean);

    expect(columns.length).to.equal(3);
    expect(cells.length).to.equal(12);

    const [nameHeaderCellContent, surnameHeaderCellContent, roleHeaderCellContent] = cells.slice(0, 3);
    const [nameFooterCellContent, surnameFooterCellContent, roleFooterCellContent] = cells.slice(3, 6);
    const [nameBodyCellContent1, surnameBodyCellContent1, roleBodyCellContent1] = cells.slice(6, 9);
    const [nameBodyCellContent2, surnameBodyCellContent2, roleBodyCellContent2] = cells.slice(9, 12);

    expect(nameHeaderCellContent).to.equal('Name');
    expect(surnameHeaderCellContent).to.equal('Surname');
    expect(roleHeaderCellContent).to.equal('Role');

    expect(nameFooterCellContent).to.equal('Name Footer');
    expect(surnameFooterCellContent).to.equal('Surname Footer');
    expect(roleFooterCellContent).to.equal('Role Footer');

    expect(nameBodyCellContent1).to.equal('John');
    expect(surnameBodyCellContent1).to.equal('Lennon');
    expect(roleBodyCellContent1).to.equal('singer');

    expect(nameBodyCellContent2).to.equal('Ringo');
    expect(surnameBodyCellContent2).to.equal('Starr');
    expect(roleBodyCellContent2).to.equal('drums');
  });
});
