import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { DatePickerLight } from "../src/DatePickerLight.js";
describe("DatePickerLight", () => {
    it("should render correctly", () => {
        render(<DatePickerLight />);
        expect(document.querySelector("vaadin-date-picker-light")).not.to.be.undefined;
    });
});
