import { ProcessedRotatedImagesResult } from "@/service/ocr";

/**
 * helper function to assert the results of the adp earnings statement
 * @param result
 */
export const assertAdpEarningsStatement = (
  result: ProcessedRotatedImagesResult
): void => {
  // we should have 4 results, one for each orientation
  expect(result.length).toBe(4);

  // each result should contain these properties
  result.forEach((r) => {
    expect(r.confidence).toBeDefined();
    expect(r.documents).toBeDefined();
    expect(r.image).toBeDefined();
    expect(r.percentages).toBeDefined();
    expect(r.rotatedOrientation).toBeDefined();
  });

  // only one of the results should have a confidence greater than 70
  const highConfidenceResults = result.filter((r) => r.confidence > 70);
  // that result should should have the expected documents
  expect(highConfidenceResults.length).toBe(1);
  const expectedDocs = {
    adpEarningsStatement: {
      company: "H GREG NISSAN DELRAY LLC",
      employeeName: "ASHLEY STELMAN",
      payDate: "04/28/2023",
      earnings: "3,286.78",
      netPay: "2,921.82",
    },
    w2: {
      wagesTipsOthers: "3,286.78",
    },
  };

  expect(highConfidenceResults[0].documents).toEqual(expectedDocs);

  // expect all other results to have a confidence less than 70
  const lowConfidenceResults = result.filter((r) => r.confidence < 70);
  expect(lowConfidenceResults.length).toBe(3);

  // expect all other results to have empty documents
  lowConfidenceResults.forEach((r) => {
    expect(r.documents.w2).toEqual({});
    expect(r.documents.adpEarningsStatement).toEqual({});
  });
};
