import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { SplitLayout } from "../src/SplitLayout.js";
describe("SplitLayout", () => {
    it("should render correctly", () => {
        render(<SplitLayout />);
        expect(document.querySelector("vaadin-split-layout")).not.to.be.undefined;
    });
});
