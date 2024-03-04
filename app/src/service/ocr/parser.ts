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

export const parseEarningsStatement = (
  text: string,
  logger: typeof ocrLogger
): Partial<EmployerData> => {
  logger.info("Parsing earnings statement");

  const results = {} as Partial<EmployerData>;

  // a variable (a map) to store the regex and field name to be used in the loop
  const patterns = {
    company: /(H GREG NISSAN DELRAY LLC)/,
    employeeName: /(\bASHLEY STELMAN\b)/,
    employeeAddress: /(1306 HELLIWELL ST NW\s*PALM BAY FL 32907)/,
    payPeriod:
      /Period Starting:\s*(\d{2}\/\d{2}\/\d{4})\s*Period Ending:\s*(\d{2}\/\d{2}\/\d{4})/,
    payDate: /Pay Date:\s*(\d{2}\/\d{2}\/\d{4})/,
    earnings: /Regular\s*([\d,.]+)\s*([\d,.]+)/,
    deductions:
      /Federal Income Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*Social Security Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*Medicare Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*State Income Tax\s*-([\d,.]+)\s*-([\d,.]+)/,
    netPay: /Net Pay\s*\$([\d,.]+)/,
  };

  // iterate through the patterns and log the attempt and result.
  for (const [label, pattern] of Object.entries(patterns)) {
    logger.info(`Matching ${label}`);
    const match = text.match(pattern);

    if (match) {
      logger.info(label, match[1]);
      results[label as keyof EmployerData] = match[1];
    }

    logger.info(label, match ? match[1] : "null");
  }

  return results;
};

export const parseW2Data = (outputText: string): ParsedData => {
  const employerInfoPattern =
    /\b(\d{2}-\d{7})\s+(\d+,\d+\.\d{2}|\d+\.\d{2})\s+(\d+,\d+\.\d{2}|\d+\.\d{2})/;
  const employerMatch = outputText.match(employerInfoPattern);

  const employeeAddressPattern = /Shawn Bailey\s*(.*?)\s*\d{3}-\d{2}-\d{4}/;
  const employeeAddressMatch = outputText.match(employeeAddressPattern);

  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;
  const ssnMatches = outputText.match(ssnPattern);

  const bottomLinesPattern = /(Form W-2 Statement[\s\S]*?)$/;
  const bottomLinesMatch = outputText.match(bottomLinesPattern);

  return {
    employer: {
      employerIdentificationNumber: employerMatch ? employerMatch[1] : "",
      wagesTipsOthers: employerMatch ? employerMatch[2] : "",
      federalIncomeTaxWithheld: employerMatch ? employerMatch[3] : "",
    },
    employeeAddress: employeeAddressMatch ? employeeAddressMatch[1].trim() : "",
    ssn: ssnMatches && ssnMatches.length > 0 ? ssnMatches[0] : "",
    bottomLines: bottomLinesMatch ? bottomLinesMatch[1].trim() : "",
  };
};
