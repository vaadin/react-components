import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { VirtualList } from "../src/VirtualList.js";
describe("VirtualList", () => {
    it("should render correctly", () => {
        render(<VirtualList />);
        expect(document.querySelector("vaadin-virtual-list")).not.to.be.undefined;
    });
});
