import { describe, expect, it } from "vitest";
import { createDocumentImage, createLogger } from "@/service/factory";
import ocr, { DocumentMatcher } from "@/service/ocr";
import { adpEarningsStatement } from "@/service/ocr/document/adpEarningsStatement";
import { parseOcrResult } from "@/service/ocr/parser";
import path from "path";

const { getTextFromImagePath, process, processRotatedImages } = ocr;
const adpEarningsStatementPatterns = adpEarningsStatement.patterns;
const logger = createLogger("ocr-parser");

// spy on the logger to capture log messages
vi.spyOn(logger, "info");

// Define a sample matcher with patterns to simulate a realistic scenario
const testParserPatterns = {
  line1: /(Line 1 Pattern to check for)/,
  line2: /(Line 2 Pattern to check for)/,
  line3: /(Line 3 Pattern to check for)/,
  ...adpEarningsStatementPatterns,
};

// Define our document matchers
const documentMatchers = [
  {
    id: "testDocument",
    name: "Test Document Matcher",
    patterns: testParserPatterns,
  },
] as DocumentMatcher<"testDocument", typeof testParserPatterns>[];

describe("parseOcrResult", () => {
  it("should correctly parse document text and return matched patterns", () => {
    // Define a sample document text that includes some of the patterns
    const documentText = `H GREG NISSAN DELRAY LLC
    ASHLEY STELMAN
    1306 HELLIWELL ST NW PALM BAY FL 32907`;

    const expected = {
      testDocument: {
        company: "H GREG NISSAN DELRAY LLC",
        employeeName: "ASHLEY STELMAN",
        employeeAddress: "1306 HELLIWELL ST NW PALM BAY FL 32907",
      },
    };

    const result = parseOcrResult(documentText, documentMatchers, logger);

    // Assert the result matches the expected output
    expect(result).toEqual(expected);

    // Assert the logger was called with specific messages
    expect(logger.info).toHaveBeenCalledWith(
      "company: H GREG NISSAN DELRAY LLC"
    );
    expect(logger.info).toHaveBeenCalledWith("employeeName: ASHLEY STELMAN");
    expect(logger.info).toHaveBeenCalledWith(
      "employeeAddress: 1306 HELLIWELL ST NW PALM BAY FL 32907"
    );
  });

  it("should have null values for fields that did not match a pattern", () => {
    const documentText = `Line 1 Pattern to check for
     Line 2 Pattern to check for`;

    const expected = {
      testDocument: {
        line1: "Line 1 Pattern to check for",
        line2: "Line 2 Pattern to check for",
      },
    };

    const result = parseOcrResult(documentText, documentMatchers, logger);

    // Assert the result matches the expected output
    expect(result).toEqual(expected);

    // Assert that the logger captures null values for fields without matches
    expect(logger.info).toHaveBeenCalledWith("company: null");
    expect(logger.info).toHaveBeenCalledWith("employeeName: null");
    expect(logger.info).toHaveBeenCalledWith("employeeAddress: null");
  });

  it("should handle documents with no matches", () => {
    const documentText = `Unrelated text that does not match any pattern`;
    const expected = {
      testDocument: {},
    };
    const result = parseOcrResult(documentText, documentMatchers, logger);

    // Assert the result is an empty object for no matches
    expect(result).toEqual(expected);
  });

  it("should run ocr on a real document and parse it for matching document fields", async () => {
    const testDocumentPath = path.join(
      __dirname,
      "../fixture/adp-earnings-statement1.jpeg"
    );
    const documentImage = await createDocumentImage(testDocumentPath);
    const documentText = await getTextFromImagePath(documentImage, {
      debug: true,
    });
    const result = parseOcrResult(documentText, documentMatchers, logger);
    const expected = {
      testDocument: {
        company: "H GREG NISSAN DELRAY LLC",
        employeeName: "ASHLEY STELMAN",
        payDate: "04/28/2023",
        earnings: "3,286.78",
        netPay: "292182",
      },
    };
    expect(result).toEqual(expected);
  });
});

describe("process", () => {
  it("should process a document and return parsed data", async () => {
    const testDocumentPath = path.join(
      __dirname,
      "../fixture/adp-earnings-statement1.jpeg"
    );
    const documentImage = await createDocumentImage(testDocumentPath);
    const result = await process(documentImage);
    const expectedDocs = {
      adpEarningsStatement: {
        company: "H GREG NISSAN DELRAY LLC",
        earnings: "3,286.78",
        employeeName: "ASHLEY STELMAN",
        netPay: "292182",
        payDate: "04/28/2023",
      },
      w2: {
        wagesTipsOthers: "3,286.78",
      },
    };
    expect(result.documents).toEqual(expectedDocs);
    expect(result.percentages.adpEarningsStatement).toBe(63);
    expect(result.percentages.w2).toBe(17);
    expect(result.image).toEqual(documentImage);
  });
});

describe("processRotatedImages", () => {
  it.only("should process a document and return parsed data for each orientation", async () => {
    const testDocumentPath = path.join(
      __dirname,
      "../fixture/adp-earnings-statement1.jpeg"
    );
    const documentImage = await createDocumentImage(testDocumentPath);
    const result = await processRotatedImages(documentImage);
    const expectedDocs = {
      adpEarningsStatement: {
        company: "H GREG NISSAN DELRAY LLC",
        earnings: "3,286.78",
        employeeName: "ASHLEY STELMAN",
        netPay: "292182",
        payDate: "04/28/2023",
      },
      w2: {
        wagesTipsOthers: "3,286.78",
      },
    };
    for (const orientation in result) {
      expect(result[orientation].documents).toEqual(expectedDocs);
      expect(result[orientation].percentages.adpEarningsStatement).toBe(63);
      expect(result[orientation].percentages.w2).toBe(17);
      expect(result[orientation].image).toEqual(documentImage);
    }
  }, {timeout: 30000});
});