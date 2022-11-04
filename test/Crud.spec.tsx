import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Crud } from "../src/Crud.js";
describe("Crud", () => {
    it("should render correctly", () => {
        render(<Crud />);
        expect(document.querySelector("vaadin-crud")).not.to.be.undefined;
    });
});
