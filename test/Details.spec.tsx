import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Details } from "../src/Details.js";
describe("Details", () => {
    it("should render correctly", () => {
        render(<Details />);
        expect(document.querySelector("vaadin-details")).not.to.be.undefined;
    });
});
