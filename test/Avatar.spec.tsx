import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Avatar } from "../src/Avatar.js";
describe("Avatar", () => {
    it("should render correctly", () => {
        render(<Avatar />);
        expect(document.querySelector("vaadin-avatar")).not.to.be.undefined;
    });
});
