import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Scroller } from "../src/Scroller.js";
describe("Scroller", () => {
    it("should render correctly", () => {
        render(<Scroller />);
        expect(document.querySelector("vaadin-scroller")).not.to.be.undefined;
    });
});
