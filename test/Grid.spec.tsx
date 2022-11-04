import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Grid } from "../src/Grid.js";
describe("Grid", () => {
    it("should render correctly", () => {
        render(<Grid />);
        expect(document.querySelector("vaadin-grid")).not.to.be.undefined;
    });
});
