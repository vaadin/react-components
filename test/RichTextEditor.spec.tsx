import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { RichTextEditor } from "../src/RichTextEditor.js";
describe("RichTextEditor", () => {
    it("should render correctly", () => {
        render(<RichTextEditor />);
        expect(document.querySelector("vaadin-rich-text-editor")).not.to.be.undefined;
    });
});
