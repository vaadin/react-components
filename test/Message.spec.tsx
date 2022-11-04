import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Message } from "../src/Message.js";
describe("Message", () => {
    it("should render correctly", () => {
        render(<Message />);
        expect(document.querySelector("vaadin-message")).not.to.be.undefined;
    });
});
