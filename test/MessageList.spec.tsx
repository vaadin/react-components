import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { MessageList } from "../src/MessageList.js";
describe("MessageList", () => {
    it("should render correctly", () => {
        render(<MessageList />);
        expect(document.querySelector("vaadin-message-list")).not.to.be.undefined;
    });
});
