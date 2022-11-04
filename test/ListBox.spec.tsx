import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ListBox } from "../src/ListBox.js";
describe("ListBox", () => {
    it("should render correctly", () => {
        render(<ListBox />);
        expect(document.querySelector("vaadin-list-box")).not.to.be.undefined;
    });
});
