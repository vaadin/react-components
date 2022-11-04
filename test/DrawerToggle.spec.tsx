import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { DrawerToggle } from "../src/DrawerToggle.js";
describe("DrawerToggle", () => {
    it("should render correctly", () => {
        render(<DrawerToggle />);
        expect(document.querySelector("vaadin-drawer-toggle")).not.to.be.undefined;
    });
});
