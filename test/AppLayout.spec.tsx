import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { AppLayout } from "../src/AppLayout.js";
describe("AppLayout", () => {
    it("should render correctly", () => {
        render(<AppLayout />);
        expect(document.querySelector("vaadin-app-layout")).not.to.be.undefined;
    });
});
