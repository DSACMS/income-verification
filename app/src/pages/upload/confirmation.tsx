import { ParsingFunctionResult } from "@/service/ocr/parser";
import {
  Alert,
  IconList,
  IconListContent,
  IconListItem,
} from "@trussworks/react-uswds";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";

import type {
  BlurryDetectorResults,
  OCRDectionResponse,
  ResponseData,
} from "../api/upload";

type ParsedBlurDecetorResults = ResponseData & {
  results: BlurryDetectorResults;
};

const BLURRINESS_THRESHOLD = 45;

const formatImagePath = (path: string) => {
  return (path.match("([^/]+$)") || [])[0];
};

const createBlurrinessIncidatorText = (isBlurry: boolean) => {
  return isBlurry ? " is blurry." : " successfully uploaded.";
};

const createLegibileIncidatorText = (isBlurry: boolean) => {
  return isBlurry ? " may be too blurry to read." : " successfully uploaded.";
};

const createBlurrinessIncidatorIcon = (isBlurry: boolean) => {
  return (
    <>
      <span className="usa-icon-list__icon">
        <svg
          className={isBlurry ? "usa-icon text-red" : "usa-icon text-green"}
          aria-hidden="true"
          focusable="false"
          role="img"
        >
          <use
            href={`${
              isBlurry
                ? "/uswds/img/sprite.svg#error"
                : "/uswds/img/sprite.svg#check_circle"
            }`}
          ></use>
        </svg>
      </span>
    </>
  );
};

const renderDocumentFields = (docFields: ParsingFunctionResult) => {
  // ignore the top-level keys, just show an alert if there is any
  // data in the second level
  const recognizedData = Object.entries(docFields)
    .map(([, fields]) => {
      return Object.entries(fields).filter(([, v]) => v !== "");
    })
    .flat();

  if (recognizedData.length > 0) {
    return (
      <Alert
        type="success"
        heading="We recognized text in your document!"
        headingLevel="h4"
      >
        <strong>For demo purposes:</strong>{" "}
        <span>
          We were able to recognize the following fields, which we could send to
          the caseworker:
        </span>
        <ul>
          {recognizedData.map(([field, value], i) => (
            <li key={i}>
              <strong>{field}</strong>: {value}
            </li>
          ))}
        </ul>
      </Alert>
    );
  }
};

const renderOcrResults = (results: OCRDectionResponse) => {
  const elements = results.fulfilled.map((documentResults, index) => {
    // get the orientation with the highest confidence
    const highestConfidenceScore = Math.max(
      ...documentResults.map((doc) => doc.confidence)
    );
    const highestConfidenceOrientation = documentResults.filter(
      (doc) => doc.confidence === highestConfidenceScore
    )[0];
    const docFields = highestConfidenceOrientation.documents;
    const isIllegible =
      highestConfidenceOrientation.confidence < BLURRINESS_THRESHOLD;

    return (
      <div key={`document-${index}`}>
        <IconListItem key={index} className="usa-icon-list__item">
          <>
            {createBlurrinessIncidatorIcon(isIllegible)}
            <IconListContent>
              {" "}
              {formatImagePath(highestConfidenceOrientation.fileName)}
              {createLegibileIncidatorText(isIllegible)}
              {` (confidence: ${highestConfidenceScore})`}
            </IconListContent>
          </>
        </IconListItem>
        {renderDocumentFields(docFields)}
      </div>
    );
  });

  return <div>{elements}</div>;
};

const renderBlurDetectorResults = (
  results: ParsedBlurDecetorResults["results"]
) => {
  return (
    <div>
      <IconList className="padding-2 word-break-all">
        {results?.map((result, idx) => (
          <IconListItem key={idx} className="usa-icon-list__item">
            {result.value && (
              <>
                {createBlurrinessIncidatorIcon(result.value.isBlurry)}
                <IconListContent>
                  {" "}
                  {formatImagePath(result.value.imagePath)}
                  {createBlurrinessIncidatorText(result.value.isBlurry)}
                </IconListContent>
              </>
            )}
            {result.reason && (
              <>
                {createBlurrinessIncidatorIcon(result.reason.isBlurry)}
                <IconListContent>
                  {" "}
                  {formatImagePath(result.reason.imagePath)}
                  {createBlurrinessIncidatorText(result.reason.isBlurry)}
                </IconListContent>
              </>
            )}
          </IconListItem>
        ))}
      </IconList>
    </div>
  );
};

const Confirmation: NextPage = () => {
  const router = useRouter();
  const results = router.query?.results;

  const renderProcessingResults = (results?: string) => {
    if (!results) {
      return <>Could not render results</>;
    }
    const parsedResults = JSON.parse(results.toString()) as ResponseData;
    return (
      <div>
        {parsedResults.engine === "blur" &&
          renderBlurDetectorResults(
            parsedResults.results as unknown as ParsedBlurDecetorResults["results"]
          )}
        {parsedResults.engine === "ocr" &&
          renderOcrResults(
            parsedResults.results as unknown as OCRDectionResponse
          )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="margin-top-5 measure-5">
        <h1 className="font-heading-2xl">We have uploaded your documents.</h1>
        <strong>Confirmation:</strong>{" "}
        <span className="usa-tag usa-tag--big bg-primary-dark">
          #8450001171
        </span>
        <p className="usa-intro">
          Thank you for uploading your documents. Here are the results:
        </p>
        {renderProcessingResults(results ? results.toString() : undefined)}
        <div className="padding-y-3">
          <h3>Await a decision on your claim</h3>
          <p>
            We will review your documents and provide a response within 5
            business days.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;
