import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { TimePicker } from "../src/TimePicker.js";
describe("TimePicker", () => {
    it("should render correctly", () => {
        render(<TimePicker />);
        expect(document.querySelector("vaadin-time-picker")).not.to.be.undefined;
    });
});
