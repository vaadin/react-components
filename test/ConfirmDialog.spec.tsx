import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ConfirmDialog } from "../src/ConfirmDialog.js";
describe("ConfirmDialog", () => {
    it("should render correctly", () => {
        render(<ConfirmDialog />);
        expect(document.querySelector("vaadin-confirm-dialog")).not.to.be.undefined;
    });
});
