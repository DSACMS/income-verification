import { type DocumentMatcher } from ".";
import { type ADPPatterns } from "./document/adpEarningsStatement";
import { type W2Patterns } from "./document/w2";
import { logger as ocrLogger } from ".";

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

export type ParsingFunction = (documentText: string, patterns: DocumentMatcher<ParsingPatterns>[], logger: typeof ocrLogger) => Partial<ParsedData>;

export const parseOcrResult: ParsingFunction = (documentText, documentMatchers, logger): ParsedData => {
  logger.info("Parsing W2 Data");

  const results: Partial<ParsedData> = {
    employer: {} as EmployerData,
    employeeAddress: '',
    ssn: '',
    bottomLines: ''
  };

  const patterns = documentMatchers.reduce((acc, matcher) => {
    for (const [key, pattern] of Object.entries(matcher.patterns)) {

      const match = documentText.match(pattern);
      if (match) {
        if (results.employer && key in results.employer) {
          results.employer[key as keyof EmployerData] = match[1];
        } else {
          results[key as keyof Omit<ParsedData, 'employer'>] = match[1].trim();
        }
      }
      logger.info(`${key}: ${match ? match[1] : "null"}`);
    }

    return acc;
  }, {});

  return results as ParsedData;
}