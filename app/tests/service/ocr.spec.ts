import { describe, it, expect } from 'vitest';
import { parseOcrResult } from '@/service/ocr/parser'; // Adjust the import path as necessary
import { createLogger } from '@/utils/logger';
import { patterns as adpEarningsStatementPatterns } from '@/service/ocr/document/adpEarningsStatement';
import ocr from '@/service/ocr';
import path from 'path';

const { scanImage } = ocr;
const logger = createLogger('ocr-parser');

// spy on the logger to capture log messages
vi.spyOn(logger, 'info');

// Define a sample matcher with patterns to simulate a realistic scenario
const documentMatchers = [
  {
    id: 'testDocument',
    name: 'Test Document Matcher',
    patterns: {
      line1: /(Line 1 Pattern to check for)/,
      line2: /(Line 2 Pattern to check for)/,
      line3: /(Line 3 Pattern to check for)/,
      ...adpEarningsStatementPatterns
    },
  },
];

describe('parseOcrResult', () => {
  it('should correctly parse document text and return matched patterns', () => {
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
    expect(logger.info).toHaveBeenCalledWith("company: H GREG NISSAN DELRAY LLC");
    expect(logger.info).toHaveBeenCalledWith("employeeName: ASHLEY STELMAN");
    expect(logger.info).toHaveBeenCalledWith("employeeAddress: 1306 HELLIWELL ST NW PALM BAY FL 32907");
  });


  it('should have null values for fields that did not match a pattern', () => {
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

  it('should handle documents with no matches', () => {
    const documentText = `Unrelated text that does not match any pattern`;
    const expected = {};
    const result = parseOcrResult(documentText, documentMatchers, logger);

    // Assert the result is an empty object for no matches
    expect(result).toEqual(expected);
  });

  it('should run ocr on a real document and parse it for matching document fields', async () => {
    const testDocumentPath = path.join(
      __dirname,
      "../fixture/adp-earnings-statement1.jpeg"
    );
    const documentText = await scanImage(testDocumentPath, { debug: true });
    const result = parseOcrResult(documentText, documentMatchers, logger);
    const expected = {
      testDocument: {
        company: "H GREG NISSAN DELRAY LLC",
        employeeName: "ASHLEY STELMAN",
        payDate: "04/28/2023",
        earnings: "3,286.78",
        netPay: "292182",
      }
    };
    expect(result).toEqual(expected);
  });
});
