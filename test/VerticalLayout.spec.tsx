import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { VerticalLayout } from "../src/VerticalLayout.js";
describe("VerticalLayout", () => {
    it("should render correctly", () => {
        render(<VerticalLayout />);
        expect(document.querySelector("vaadin-vertical-layout")).not.to.be.undefined;
    });
});
