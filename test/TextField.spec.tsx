import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { TextField } from "../src/TextField.js";
describe("TextField", () => {
    it("should render correctly", () => {
        render(<TextField />);
        expect(document.querySelector("vaadin-text-field")).not.to.be.undefined;
    });
});
