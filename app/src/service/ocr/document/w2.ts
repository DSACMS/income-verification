export const patterns = {
    employerIdentificationNumber: /\b(\d{2}-\d{7})/,
    wagesTipsOthers: /(\d+,\d+\.\d{2}|\d+\.\d{2})\s+/,
    federalIncomeTaxWithheld: /(\d+,\d+\.\d{2}|\d+\.\d{2})$/,
    employeeAddress: /Shawn Bailey\s*(.*?)\s*\d{3}-\d{2}-\d{4}/,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/,
    bottomLines: /(Form W-2 Statement[\s\S]*?)$/
};

export type W2StatementPatterns = Record<keyof typeof patterns, RegExp>;
