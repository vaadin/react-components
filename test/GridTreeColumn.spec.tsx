import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridTreeColumn } from "../src/GridTreeColumn.js";
describe("GridTreeColumn", () => {
    it("should render correctly", () => {
        render(<GridTreeColumn />);
        expect(document.querySelector("vaadin-grid-tree-column")).not.to.be.undefined;
    });
});
