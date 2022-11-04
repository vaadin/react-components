import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { NumberField } from "../src/NumberField.js";
describe("NumberField", () => {
    it("should render correctly", () => {
        render(<NumberField />);
        expect(document.querySelector("vaadin-number-field")).not.to.be.undefined;
    });
});
