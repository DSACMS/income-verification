import { createDocumentMatcher } from "@/service/factory";

export const w2Form = createDocumentMatcher("W2 Form", "w2", {
  employerIdentificationNumber: /\b(\d{2}-\d{7})/,
  wagesTipsOthers: /(\d+,\d+\.\d{2}|\d+\.\d{2})\s+/,
  federalIncomeTaxWithheld: /(\d+,\d+\.\d{2}|\d+\.\d{2})$/,
  employeeAddress: /Shawn Bailey\s*(.*?)\s*\d{3}-\d{2}-\d{4}/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  bottomLines: /(Form W-2 Statement[\s\S]*?)$/,
});

export type W2FormPatterns = typeof w2Form.patterns;
