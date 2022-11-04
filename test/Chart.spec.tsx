import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Chart } from "../src/Chart.js";
describe("Chart", () => {
    it("should render correctly", () => {
        render(<Chart />);
        expect(document.querySelector("vaadin-chart")).not.to.be.undefined;
    });
});
