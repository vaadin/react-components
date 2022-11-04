import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridSortColumn } from "../src/GridSortColumn.js";
describe("GridSortColumn", () => {
    it("should render correctly", () => {
        render(<GridSortColumn />);
        expect(document.querySelector("vaadin-grid-sort-column")).not.to.be.undefined;
    });
});
