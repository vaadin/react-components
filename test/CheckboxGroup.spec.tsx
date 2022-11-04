import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { CheckboxGroup } from "../src/CheckboxGroup.js";
describe("CheckboxGroup", () => {
    it("should render correctly", () => {
        render(<CheckboxGroup />);
        expect(document.querySelector("vaadin-checkbox-group")).not.to.be.undefined;
    });
});
