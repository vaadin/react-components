import { expect } from "@esm-bundle/chai";
import { render } from "@testing-library/react";
import { Map } from "../src/Map.js";
describe("Map", () => {
    it("should render correctly", () => {
        render(<Map />);
        expect(document.querySelector("vaadin-map")).not.to.be.undefined;
    });
});
