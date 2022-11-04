import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { CookieConsent } from "../src/CookieConsent.js";
describe("CookieConsent", () => {
    it("should render correctly", () => {
        render(<CookieConsent />);
        expect(document.querySelector("vaadin-cookie-consent")).not.to.be.undefined;
    });
});
