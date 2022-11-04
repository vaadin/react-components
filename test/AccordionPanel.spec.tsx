import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { AccordionPanel } from "../src/AccordionPanel.js";
describe("AccordionPanel", () => {
    it("should render correctly", () => {
        render(<AccordionPanel />);
        expect(document.querySelector("vaadin-accordion-panel")).not.to.be.undefined;
    });
});
