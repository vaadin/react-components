import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { LoginForm } from "../src/LoginForm.js";
describe("LoginForm", () => {
    it("should render correctly", () => {
        render(<LoginForm />);
        expect(document.querySelector("vaadin-login-form")).not.to.be.undefined;
    });
});
