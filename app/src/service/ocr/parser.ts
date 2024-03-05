import { type DocumentMatcher } from ".";
import { logger as ocrLogger } from ".";

// document parsers
import { type ADPPatterns, adpEarningsStatement} from "@/service/ocr/document/adpEarningsStatement";
import { type W2FormPatterns, w2Form} from "@/service/ocr/document/w2";

export const parsers = {
  adpEarningsStatement: adpEarningsStatement,
  w2: w2Form,
};

export type ParserKeys = keyof typeof parsers;

export type EmployerData = {
  employerIdentificationNumber: string;
  wagesTipsOthers: string;
  federalIncomeTaxWithheld: string;
};

export type ParsedData = {
  employer: EmployerData;
  employeeAddress: string;
  ssn: string;
  bottomLines: string;
};
export type ParsingPatterns = ADPPatterns | W2FormPatterns;

export type ParsingFunctionResult = Record<ParserKeys, Record<string, string>>;

export type ParsingFunction = (
  documentText: string,
  patterns: DocumentMatcher<ParserKeys, ParsingPatterns>[],
  logger: typeof ocrLogger) => ParsingFunctionResult

  export const parseOcrResult: ParsingFunction = (documentText, documentMatchers, logger): ParsingFunctionResult => {
    logger.info("Parsing OCR Data");
  
    const documentMatches = documentMatchers.reduce((acc: ParsingFunctionResult, matcher: DocumentMatcher<ParserKeys, Record<string, RegExp>>) => {
      const { id, patterns } = matcher;
      acc[id] = acc[id] || {}; // Ensure the key exists
      
      for (const [key, pattern] of Object.entries(patterns)) {
        const match = documentText.match(pattern);
        if (match && match[1]) {
          acc[id][key] = match[1]; // Assign the string match to the result object
        }
        logger.info(`${key}: ${match && match[1] ? match[1] : "null"}`);
      }

      return acc;
    }, {} as ParsingFunctionResult);
  
    return documentMatches;
  };
  