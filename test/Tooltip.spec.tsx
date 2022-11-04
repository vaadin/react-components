import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Tooltip } from "../src/Tooltip.js";
describe("Tooltip", () => {
    it("should render correctly", () => {
        render(<Tooltip />);
        expect(document.querySelector("vaadin-tooltip")).not.to.be.undefined;
    });
});
