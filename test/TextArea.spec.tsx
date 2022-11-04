import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { TextArea } from "../src/TextArea.js";
describe("TextArea", () => {
    it("should render correctly", () => {
        render(<TextArea />);
        expect(document.querySelector("vaadin-text-area")).not.to.be.undefined;
    });
});
