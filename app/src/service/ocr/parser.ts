import { type DocumentMatcher } from ".";
import { type ADPPatterns } from "./document/adpEarningsStatement";
import { type W2Patterns } from "./document/w2";
import { logger as ocrLogger } from ".";
// document parsers
import { adpEarningsStatement } from "@/service/ocr/document/adpEarningsStatement";
import { w2 } from "@/service/ocr/document/w2";

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

export type ParsingPatterns = ADPPatterns | W2Patterns;
export type ParsingFunctionResult = Record<'w2' | 'adpEarningsStatement', Partial<ParsingPatterns>>

export type ParsingFunction = (
  documentText: string,
  patterns: DocumentMatcher<ParsingPatterns>[],
  // todo the Record string should be a generic union that's dynaimcally determined. hard-coding for now
  logger: typeof ocrLogger) => ParsingFunctionResult

export const parsers = {
  adpEarningsStatement,
  w2,
};

export const parseOcrResult: ParsingFunction = (documentText, documentMatchers, logger): ParsingFunctionResult => {
  logger.info("Parsing W2 Data");

  const documentMatches = documentMatchers.reduce((acc: ParsingFunctionResult, matcher) => {
    for (const [key, pattern] of Object.entries(matcher.patterns)) {

      const match = documentText.match(pattern);
      if (match) {
        acc[matcher.id] = { ...acc[matcher.id], [key]: match[1] };
      }
      logger.info(`${key}: ${match ? match[1] : "null"}`);
    }

    return acc;
  }, {} as ParsingFunctionResult);

  return documentMatches;
}