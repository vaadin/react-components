import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridFilterColumn } from "../src/GridFilterColumn.js";
describe("GridFilterColumn", () => {
    it("should render correctly", () => {
        render(<GridFilterColumn />);
        expect(document.querySelector("vaadin-grid-filter-column")).not.to.be.undefined;
    });
});
