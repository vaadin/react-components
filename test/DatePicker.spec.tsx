import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { DatePicker } from "../src/DatePicker.js";
describe("DatePicker", () => {
    it("should render correctly", () => {
        render(<DatePicker />);
        expect(document.querySelector("vaadin-date-picker")).not.to.be.undefined;
    });
});
