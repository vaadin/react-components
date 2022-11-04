import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { EmailField } from "../src/EmailField.js";
describe("EmailField", () => {
    it("should render correctly", () => {
        render(<EmailField />);
        expect(document.querySelector("vaadin-email-field")).not.to.be.undefined;
    });
});
