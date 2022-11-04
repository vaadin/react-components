import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Iconset } from "../src/Iconset.js";
describe("Iconset", () => {
    it("should render correctly", () => {
        render(<Iconset />);
        expect(document.querySelector("vaadin-iconset")).not.to.be.undefined;
    });
});
