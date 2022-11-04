import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { RadioButton } from "../src/RadioButton.js";
describe("RadioButton", () => {
    it("should render correctly", () => {
        render(<RadioButton />);
        expect(document.querySelector("vaadin-radio-button")).not.to.be.undefined;
    });
});
