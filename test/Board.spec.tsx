import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Board } from "../src/Board.js";
describe("Board", () => {
    it("should render correctly", () => {
        render(<Board />);
        expect(document.querySelector("vaadin-board")).not.to.be.undefined;
    });
});
