import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { AvatarGroup } from "../src/AvatarGroup.js";
describe("AvatarGroup", () => {
    it("should render correctly", () => {
        render(<AvatarGroup />);
        expect(document.querySelector("vaadin-avatar-group")).not.to.be.undefined;
    });
});
