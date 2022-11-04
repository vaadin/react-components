import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { PasswordField } from "../src/PasswordField.js";
describe("PasswordField", () => {
    it("should render correctly", () => {
        render(<PasswordField />);
        expect(document.querySelector("vaadin-password-field")).not.to.be.undefined;
    });
});
