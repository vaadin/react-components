import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { CustomField } from "../src/CustomField.js";
describe("CustomField", () => {
    it("should render correctly", () => {
        render(<CustomField />);
        expect(document.querySelector("vaadin-custom-field")).not.to.be.undefined;
    });
});
