import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridTreeToggle } from "../src/GridTreeToggle.js";
describe("GridTreeToggle", () => {
    it("should render correctly", () => {
        render(<GridTreeToggle />);
        expect(document.querySelector("vaadin-grid-tree-toggle")).not.to.be.undefined;
    });
});
