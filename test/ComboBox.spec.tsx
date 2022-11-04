import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ComboBox } from "../src/ComboBox.js";
describe("ComboBox", () => {
    it("should render correctly", () => {
        render(<ComboBox />);
        expect(document.querySelector("vaadin-combo-box")).not.to.be.undefined;
    });
});
