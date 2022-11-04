import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { IntegerField } from "../src/IntegerField.js";
describe("IntegerField", () => {
    it("should render correctly", () => {
        render(<IntegerField />);
        expect(document.querySelector("vaadin-integer-field")).not.to.be.undefined;
    });
});
