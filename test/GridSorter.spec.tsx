import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridSorter } from "../src/GridSorter.js";
describe("GridSorter", () => {
    it("should render correctly", () => {
        render(<GridSorter />);
        expect(document.querySelector("vaadin-grid-sorter")).not.to.be.undefined;
    });
});
