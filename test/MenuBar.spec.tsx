import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { MenuBar } from "../src/MenuBar.js";
describe("MenuBar", () => {
    it("should render correctly", () => {
        render(<MenuBar />);
        expect(document.querySelector("vaadin-menu-bar")).not.to.be.undefined;
    });
});
