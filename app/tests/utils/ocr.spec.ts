import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from "@jest/globals";

import ocr from "src/utils/ocr";
import { parseEarningsStatement, parseW2Data } from "src/utils/ocr/parser";

describe("./src/utils/ocr/index.ts - OCR", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("parseEarningsStatement", () => {
        describe("when the earnings statement is valid", () => {
            it("should parse the earnings statement correctly", () => {
                const earningsStatement = "Sample earnings statement";
                const result = parseEarningsStatement(earningsStatement);
                expect(result).toEqual({});
            });

            // it("should test another valid case")
        });

        describe("when the earnings statement is invalid", () => {
            // it("should test some invalid case    ")
        });

    });

    describe("parseW2Data", () => {

        it("should parse the W2 data correctly", () => {
            const w2Data = "Sample W2 data";
            const result = parseW2Data(w2Data);
            expect(result).toEqual({});
        });
    });
});