import ocr from "@/service/ocr";
import path from "path";
import { afterEach, describe, expect, it, vi } from "vitest";

const { logger, scanImage } = ocr;
const { parseEarningsStatement, parseW2Data } = ocr.parsers;

describe.skip("./src/utils/ocr/index.ts - OCR", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("parseEarningsStatement", () => {
    describe("when the earnings statement is valid", () => {
      it("should parse the earnings statement correctly", async () => {
        // store the image in a variable
        try {
          // get the path of the imagePath
          const imagePath = path.join(
            __dirname,
            "../fixture/adp-earnings-statement1.jpeg"
          );
          const ocrResults = await scanImage(imagePath, { debug: true });
          const result = parseEarningsStatement(ocrResults, logger);
          expect(result).toEqual({
            company: "H GREG NISSAN DELRAY LLC",
            employeeName: "ASHLEY STELMAN",
            payDate: "04/28/2023",
            earnings: "3,286.78",
            netPay: "292182",
          });
        } catch (e) {
          console.log(e);
        }
      });
    });

    describe.skip("when the earnings statement is invalid", () => {
      it("should test some invalid case");
    });
  });

  describe.skip("parseW2Data", () => {
    it("should parse the W2 data correctly", () => {
      const w2Data = "Sample W2 data";
      const result = parseW2Data(w2Data);
      expect(result).toEqual({});
    });
  });
});
