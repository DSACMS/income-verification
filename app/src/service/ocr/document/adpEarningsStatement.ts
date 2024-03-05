import { createDocumentMatcher } from "@/service/factory";

export const adpEarningsStatement = createDocumentMatcher(
    'ADP Earnings Statement',
    'adpEarningsStatement',
    {
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
    }
);

export type ADPPatterns = typeof adpEarningsStatement.patterns;