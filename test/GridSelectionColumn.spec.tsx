import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridSelectionColumn } from "../src/GridSelectionColumn.js";
describe("GridSelectionColumn", () => {
    it("should render correctly", () => {
        render(<GridSelectionColumn />);
        expect(document.querySelector("vaadin-grid-selection-column")).not.to.be.undefined;
    });
});
