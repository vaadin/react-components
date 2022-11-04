import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Select } from "../src/Select.js";
describe("Select", () => {
    it("should render correctly", () => {
        render(<Select />);
        expect(document.querySelector("vaadin-select")).not.to.be.undefined;
    });
});
