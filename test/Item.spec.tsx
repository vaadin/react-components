import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Item } from "../src/Item.js";
describe("Item", () => {
    it("should render correctly", () => {
        render(<Item />);
        expect(document.querySelector("vaadin-item")).not.to.be.undefined;
    });
});
