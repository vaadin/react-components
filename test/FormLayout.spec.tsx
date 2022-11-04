import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { FormLayout } from "../src/FormLayout.js";
describe("FormLayout", () => {
    it("should render correctly", () => {
        render(<FormLayout />);
        expect(document.querySelector("vaadin-form-layout")).not.to.be.undefined;
    });
});
