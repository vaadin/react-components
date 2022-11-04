import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ChartSeries } from "../src/ChartSeries.js";
describe("ChartSeries", () => {
    it("should render correctly", () => {
        render(<ChartSeries />);
        expect(document.querySelector("vaadin-chart-series")).not.to.be.undefined;
    });
});
