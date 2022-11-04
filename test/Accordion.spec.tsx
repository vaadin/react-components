import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Accordion } from "../src/Accordion.js";
describe("Accordion", () => {
    it("should render correctly", () => {
        render(<Accordion />);
        expect(document.querySelector("vaadin-accordion")).not.to.be.undefined;
    });
});
