import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Icon } from "../src/Icon.js";
describe("Icon", () => {
    it("should render correctly", () => {
        render(<Icon />);
        expect(document.querySelector("vaadin-icon")).not.to.be.undefined;
    });
});
