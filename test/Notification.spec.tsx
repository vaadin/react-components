import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Notification } from "../src/Notification.js";
describe("Notification", () => {
    it("should render correctly", () => {
        render(<Notification />);
        expect(document.querySelector("vaadin-notification")).not.to.be.undefined;
    });
});
