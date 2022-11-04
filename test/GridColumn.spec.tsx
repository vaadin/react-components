import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridColumn } from "../src/GridColumn.js";
describe("GridColumn", () => {
    it("should render correctly", () => {
        render(<GridColumn />);
        expect(document.querySelector("vaadin-grid-column")).not.to.be.undefined;
    });
});
