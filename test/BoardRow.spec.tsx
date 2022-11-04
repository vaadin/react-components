import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { BoardRow } from "../src/BoardRow.js";
describe("BoardRow", () => {
    it("should render correctly", () => {
        render(<BoardRow />);
        expect(document.querySelector("vaadin-board-row")).not.to.be.undefined;
    });
});
