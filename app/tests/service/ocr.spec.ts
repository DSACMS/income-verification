import { createDocumentImage, createLogger } from "@/service/factories";
import ocr, { DocumentMatcher } from "@/service/ocr";
import { adpEarningsStatement } from "@/service/ocr/document/adpEarningsStatement";
import { parseOcrResult } from "@/service/ocr/parser";
import {
  getTextFromDocumentImage,
  rotateDocumentImage,
} from "@/utils/document";
import path from "path";
import { describe, expect, it } from "vitest";

const { process, processDocument } = ocr;
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
    const { text } = await getTextFromDocumentImage(documentImage, {
      debug: true,
      logger,
    });
    const result = parseOcrResult(text, documentMatchers, logger);
    const expected = {
      testDocument: {
        company: "H GREG NISSAN DELRAY LLC",
        employeeName: "ASHLEY STELMAN",
        payDate: "04/28/2023",
        earnings: "3,286.78",
        netPay: "2,921.82",
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
        netPay: "2,921.82",
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

describe("processDocument", () => {
  it(
    "should rotate an incorrectly oriented image and process it",
    async () => {
      const testDocumentPath = path.join(
        __dirname,
        "../fixture/adp-earnings-statement1.jpeg"
      );
      const documentImage = await createDocumentImage(testDocumentPath);
      // rotate the doc by 90 degrees
      const rotatedImage = await rotateDocumentImage(documentImage, 90);
      const result = await processDocument(rotatedImage);
      // we should have 4 results, one for each orientation
      expect(result.length).toBe(4);

      // each result should contain these properties
      result.forEach((r) => {
        expect(r.confidence).toBeDefined();
        expect(r.documents).toBeDefined();
        expect(r.image).toBeDefined();
        expect(r.percentages).toBeDefined();
        expect(r.rotatedOrientation).toBeDefined();
      });

      // only one of the results should have a confidence greater than 70
      const highConfidenceResults = result.filter((r) => r.confidence > 70);
      // that result should should have the expected documents
      expect(highConfidenceResults.length).toBe(1);
      const expectedDocs = {
        adpEarningsStatement: {
          company: "H GREG NISSAN DELRAY LLC",
          employeeName: "ASHLEY STELMAN",
          payDate: "04/28/2023",
          earnings: "3,286.78",
          netPay: "2,921.82",
        },
        w2: {
          wagesTipsOthers: "3,286.78",
        },
      };

      expect(highConfidenceResults[0].documents).toEqual(expectedDocs);

      // expect all other results to have a confidence less than 70
      const lowConfidenceResults = result.filter((r) => r.confidence < 70);
      expect(lowConfidenceResults.length).toBe(3);

      // expect all other results to have empty documents
      lowConfidenceResults.forEach((r) => {
        expect(r.documents.w2).toEqual({});
        expect(r.documents.adpEarningsStatement).toEqual({});
      });
    },
    {
      timeout: 15000,
    }
  );
});
