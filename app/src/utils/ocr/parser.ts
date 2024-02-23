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

export const parseEarningsStatement = (text: string): EmployerData => {
    const companyPattern = /(H GREG NISSAN DELRAY LLC)/;
    const employeeNamePattern = /(\bASHLEY STELMAN\b)/;
    const employeeAddressPattern = /(1306 HELLIWELL ST NW\s*PALM BAY FL 32907)/;
    const payPeriodPattern = /Period Starting:\s*(\d{2}\/\d{2}\/\d{4})\s*Period Ending:\s*(\d{2}\/\d{2}\/\d{4})/;
    const payDatePattern = /Pay Date:\s*(\d{2}\/\d{2}\/\d{4})/;
    const earningsPattern = /Regular\s*([\d,.]+)\s*([\d,.]+)/;
    const deductionsPattern = /Federal Income Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*Social Security Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*Medicare Tax\s*-([\d,.]+)\s*-([\d,.]+)\s*State Income Tax\s*-([\d,.]+)\s*-([\d,.]+)/;
    const netPayPattern = /Net Pay\s*\$([\d,.]+)/;

    const companyMatch = text.match(companyPattern);
    const employeeNameMatch = text.match(employeeNamePattern);
    const employeeAddressMatch = text.match(employeeAddressPattern);
    const payPeriodMatch = text.match(payPeriodPattern);
    const payDateMatch = text.match(payDatePattern);
    const earningsMatch = text.match(earningsPattern);
    const deductionsMatch = text.match(deductionsPattern);
    const netPayMatch = text.match(netPayPattern);

    return {
        companyName: companyMatch ? companyMatch[1] : '',
        employeeName: employeeNameMatch ? employeeNameMatch[1] : '',
        employeeAddress: employeeAddressMatch ? employeeAddressMatch[1] : '',
        periodStart: payPeriodMatch ? payPeriodMatch[1] : '',
        periodEnd: payPeriodMatch ? payPeriodMatch[2] : '',
        payDate: payDateMatch ? payDateMatch[1] : '',
        earnings: {
            regularHours: earningsMatch ? parseFloat(earningsMatch[1].replace(/,/g, '')) : null,
            yearToDate: earningsMatch ? parseFloat(earningsMatch[2].replace(/,/g, '')) : null,
        },
        deductions: {
            federalIncomeTax: deductionsMatch ? parseFloat(deductionsMatch[1].replace(/,/g, '')) : null,
            federalIncomeTaxYTD: deductionsMatch ? parseFloat(deductionsMatch[2].replace(/,/g, '')) : null,
            socialSecurityTax: deductionsMatch ? parseFloat(deductionsMatch[3].replace(/,/g, '')) : null,
            socialSecurityTaxYTD: deductionsMatch ? parseFloat(deductionsMatch[4].replace(/,/g, '')) : null,
            medicareTax: deductionsMatch ? parseFloat(deductionsMatch[5].replace(/,/g, '')) : null,
            medicareTaxYTD: deductionsMatch ? parseFloat(deductionsMatch[6].replace(/,/g, '')) : null,
            stateIncomeTax: deductionsMatch ? parseFloat(deductionsMatch[7].replace(/,/g, '')) : null,
            stateIncomeTaxYTD: deductionsMatch ? parseFloat(deductionsMatch[8].replace(/,/g, '')) : null,
        },
        netPay: netPayMatch ? parseFloat(netPayMatch[1].replace(/,/g, '')) : null,
    };
}

export const parseW2Data = (outputText: string): ParsedData => {
    const employerInfoPattern = /\b(\d{2}-\d{7})\s+(\d+,\d+\.\d{2}|\d+\.\d{2})\s+(\d+,\d+\.\d{2}|\d+\.\d{2})/;
    const employerMatch = outputText.match(employerInfoPattern);

    const employeeAddressPattern = /Shawn Bailey\s*(.*?)\s*\d{3}-\d{2}-\d{4}/;
    const employeeAddressMatch = outputText.match(employeeAddressPattern);

    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;
    const ssnMatches = outputText.match(ssnPattern);

    const bottomLinesPattern = /(Form W-2 Statement[\s\S]*?)$/;
    const bottomLinesMatch = outputText.match(bottomLinesPattern);

    return {
        employer: {
            employerIdentificationNumber: employerMatch ? employerMatch[1] : '',
            wagesTipsOthers: employerMatch ? employerMatch[2] : '',
            federalIncomeTaxWithheld: employerMatch ? employerMatch[3] : '',
        },
        employeeAddress: employeeAddressMatch ? employeeAddressMatch[1].trim() : '',
        ssn: ssnMatches && ssnMatches.length > 0 ? ssnMatches[0] : '',
        bottomLines: bottomLinesMatch ? bottomLinesMatch[1].trim() : ''
    };
}