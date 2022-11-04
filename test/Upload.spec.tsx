import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Upload } from "../src/Upload.js";
describe("Upload", () => {
    it("should render correctly", () => {
        render(<Upload />);
        expect(document.querySelector("vaadin-upload")).not.to.be.undefined;
    });
});
