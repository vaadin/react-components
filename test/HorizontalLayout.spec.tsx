import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { HorizontalLayout } from "../src/HorizontalLayout.js";
describe("HorizontalLayout", () => {
    it("should render correctly", () => {
        render(<HorizontalLayout />);
        expect(document.querySelector("vaadin-horizontal-layout")).not.to.be.undefined;
    });
});
