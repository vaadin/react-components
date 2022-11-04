import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Tab } from "../src/Tab.js";
describe("Tab", () => {
    it("should render correctly", () => {
        render(<Tab />);
        expect(document.querySelector("vaadin-tab")).not.to.be.undefined;
    });
});
