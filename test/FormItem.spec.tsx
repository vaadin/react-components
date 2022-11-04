import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { FormItem } from "../src/FormItem.js";
describe("FormItem", () => {
    it("should render correctly", () => {
        render(<FormItem />);
        expect(document.querySelector("vaadin-form-item")).not.to.be.undefined;
    });
});
