import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridPro } from "../src/GridPro.js";
describe("GridPro", () => {
    it("should render correctly", () => {
        render(<GridPro />);
        expect(document.querySelector("vaadin-grid-pro")).not.to.be.undefined;
    });
});
