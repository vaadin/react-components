import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { DateTimePicker } from "../src/DateTimePicker.js";
describe("DateTimePicker", () => {
    it("should render correctly", () => {
        render(<DateTimePicker />);
        expect(document.querySelector("vaadin-date-time-picker")).not.to.be.undefined;
    });
});
