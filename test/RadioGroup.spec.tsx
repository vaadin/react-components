import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { RadioGroup } from "../src/RadioGroup.js";
describe("RadioGroup", () => {
    it("should render correctly", () => {
        render(<RadioGroup />);
        expect(document.querySelector("vaadin-radio-group")).not.to.be.undefined;
    });
});
