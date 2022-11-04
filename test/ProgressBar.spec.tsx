import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { ProgressBar } from "../src/ProgressBar.js";
describe("ProgressBar", () => {
    it("should render correctly", () => {
        render(<ProgressBar />);
        expect(document.querySelector("vaadin-progress-bar")).not.to.be.undefined;
    });
});
