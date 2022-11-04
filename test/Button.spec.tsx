import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Button } from "../src/Button.js";
describe("Button", () => {
    it("should render correctly", () => {
        render(<Button />);
        expect(document.querySelector("vaadin-button")).not.to.be.undefined;
    });
});
