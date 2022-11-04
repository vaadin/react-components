import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ContextMenu } from "../src/ContextMenu.js";
describe("ContextMenu", () => {
    it("should render correctly", () => {
        render(<ContextMenu />);
        expect(document.querySelector("vaadin-context-menu")).not.to.be.undefined;
    });
});
