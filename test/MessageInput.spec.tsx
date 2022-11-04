import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { MessageInput } from "../src/MessageInput.js";
describe("MessageInput", () => {
    it("should render correctly", () => {
        render(<MessageInput />);
        expect(document.querySelector("vaadin-message-input")).not.to.be.undefined;
    });
});
