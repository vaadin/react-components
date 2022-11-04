import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridColumnGroup } from "../src/GridColumnGroup.js";
describe("GridColumnGroup", () => {
    it("should render correctly", () => {
        render(<GridColumnGroup />);
        expect(document.querySelector("vaadin-grid-column-group")).not.to.be.undefined;
    });
});
