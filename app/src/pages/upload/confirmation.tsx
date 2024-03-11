import {
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

function formatImagePath(path: string) {
  return (path.match("([^/]+$)") || [])[0];
}

function createBlurrinessIncidatorText(isBlurry: boolean) {
  return isBlurry ? " is blurry." : " successfully uploaded.";
}

function createBlurrinessIncidatorIcon(isBlurry: boolean) {
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
}

const renderOcrResults = (results: OCRDectionResponse) => {
  const elements = results.fulfilled.map((documentResults, index) => {
    // get the orientation with the highest confidence
    const highestConfidenceScore = Math.max(...documentResults.map((doc) => doc.confidence));
    const highestConfidenceOrientation = documentResults.filter(
      (doc) => doc.confidence ===highestConfidenceScore)[0];
    const docFields = highestConfidenceOrientation.documents;
    
    return (
      <div key={`document-${index}`}>
        <h3>Document {index + 1}</h3>
        <p>
          <strong>Confidence:</strong> {highestConfidenceOrientation.confidence}
        </p>
        <p>
          <strong>Rotation:</strong>{" "}
          {highestConfidenceOrientation.rotatedOrientation}
        </p>
        {JSON.stringify(docFields, null, 2)}
      </div>
    );
  });

  return <div>{elements}</div>;
};

const renderBlurDetectorResults = (results: ParsedBlurDecetorResults) => {
  return (
      <div>
  <IconList className="padding-2 word-break-all">
    {results?.results?.map((result, idx) => (
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
</div>);
}

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
            parsedResults.results as unknown as ParsedBlurDecetorResults
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