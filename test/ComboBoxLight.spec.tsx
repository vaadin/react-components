import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ComboBoxLight } from "../src/ComboBoxLight.js";
describe("ComboBoxLight", () => {
    it("should render correctly", () => {
        render(<ComboBoxLight />);
        expect(document.querySelector("vaadin-combo-box-light")).not.to.be.undefined;
    });
});
