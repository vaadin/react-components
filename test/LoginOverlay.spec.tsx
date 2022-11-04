import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { LoginOverlay } from "../src/LoginOverlay.js";
describe("LoginOverlay", () => {
    it("should render correctly", () => {
        render(<LoginOverlay />);
        expect(document.querySelector("vaadin-login-overlay")).not.to.be.undefined;
    });
});
