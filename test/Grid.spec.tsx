import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Grid } from '../src/Grid.js';
import { GridColumn } from '../src/index.js';

describe('Grid', () => {
  it('should render correctly', async () => {
    type Item = Readonly<{ name: string; surname: string; role: string }>;

    const items = [
      { name: 'John', surname: 'Lennon', role: 'singer' },
      { name: 'Ringo', surname: 'Starr', role: 'drums' },
    ];

    render(
      <Grid<Item>>
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

    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    const grid = document.querySelector('vaadin-grid');
    expect(grid).not.to.be.undefined;

    grid!.items = items;
    const columns = document.querySelectorAll('vaadin-grid-column');
    const cells = Array.from(document.querySelectorAll('vaadin-gird-cell-content'));

    expect(columns.length).to.equal(3);
    expect(cells.length).to.equal(12);

    const [nameHeaderCell, surnameHeaderCell, roleHeaderCell] = cells.slice(0, 3);
    const [nameFooterCell, surnameFooterCell, roleFooterCell] = cells.slice(3, 6);
    const [nameBodyCell1, surnameBodyCell1, roleBodyCell1] = cells.slice(6, 9);
    const [nameBodyCell2, surnameBodyCell2, roleBodyCell2] = cells.slice(9, 12);

    expect(nameHeaderCell.textContent).to.equal('Name');
    expect(surnameHeaderCell.textContent).to.equal('Surname');
    expect(roleHeaderCell.textContent).to.equal('Role');

    expect(nameFooterCell.textContent).to.equal('Name Footer');
    expect(surnameFooterCell.textContent).to.equal('Surname Footer');
    expect(roleFooterCell.textContent).to.equal('Role Footer');

    expect(nameBodyCell1.textContent).to.equal('John');
    expect(surnameBodyCell1.textContent).to.equal('Lennon');
    expect(roleBodyCell1.textContent).to.equal('singer');

    expect(nameBodyCell2.textContent).to.equal('Ringo');
    expect(surnameBodyCell2.textContent).to.equal('Starr');
    expect(roleBodyCell2.textContent).to.equal('drums');
  });
});
