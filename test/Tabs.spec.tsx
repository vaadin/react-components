import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Tabs } from "../src/Tabs.js";
describe("Tabs", () => {
    it("should render correctly", () => {
        render(<Tabs />);
        expect(document.querySelector("vaadin-tabs")).not.to.be.undefined;
    });
});
