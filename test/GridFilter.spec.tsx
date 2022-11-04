import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { GridFilter } from "../src/GridFilter.js";
describe("GridFilter", () => {
    it("should render correctly", () => {
        render(<GridFilter />);
        expect(document.querySelector("vaadin-grid-filter")).not.to.be.undefined;
    });
});
