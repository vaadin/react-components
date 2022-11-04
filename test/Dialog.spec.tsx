import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Dialog } from "../src/Dialog.js";
describe("Dialog", () => {
    it("should render correctly", () => {
        render(<Dialog />);
        expect(document.querySelector("vaadin-dialog")).not.to.be.undefined;
    });
});
