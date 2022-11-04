import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridProEditColumn } from "../src/GridProEditColumn.js";
describe("GridProEditColumn", () => {
    it("should render correctly", () => {
        render(<GridProEditColumn />);
        expect(document.querySelector("vaadin-grid-pro-edit-column")).not.to.be.undefined;
    });
});
