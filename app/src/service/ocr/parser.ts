import { OCR_Patterns, logger as ocrLogger } from ".";

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

export type ParsingFunction = (text: string, patterns: OCR_Patterns[], logger: typeof ocrLogger) => Partial<ParsedData>;

export const parseOcrResult: ParsingFunction = (text, patterns, logger): ParsedData => {
  logger.info("Parsing W2 Data");
  
  const results: Partial<ParsedData> = {
    employer: {} as EmployerData,
    employeeAddress: '',
    ssn: '',
    bottomLines: ''
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      if (results.employer && key in results.employer) {
        results.employer[key as keyof EmployerData] = match[1];
      } else {
        results[key as keyof Omit<ParsedData, 'employer'>] = match[1].trim();
      }
    }
    logger.info(`${key}: ${match ? match[1] : "null"}`);
  }

  return results as ParsedData;
}