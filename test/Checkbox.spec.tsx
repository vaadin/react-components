import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Checkbox } from "../src/Checkbox.js";
describe("Checkbox", () => {
    it("should render correctly", () => {
        render(<Checkbox />);
        expect(document.querySelector("vaadin-checkbox")).not.to.be.undefined;
    });
});
