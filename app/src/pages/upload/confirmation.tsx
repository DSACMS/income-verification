import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
} from "@trussworks/react-uswds";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";

import type { BlurryDetectorResults, ResponseData } from "../api/upload";

type ParsedBlurDetectorResults = ResponseData & {
  results?: BlurryDetectorResults;
};

const Confirmation: NextPage = () => {
  const router = useRouter();
  const results = router.query?.results;
  let parsedResults: ParsedBlurDetectorResults = { message: "" };

  if (results) {
    parsedResults = JSON.parse(results.toString()) as ParsedBlurDetectorResults;
  }

  return (
    <Layout>
      <div className="margin-top-5">
        <h1 className="font-heading-2xl">We have uploaded your documents.</h1>
        <strong>Confirmation:</strong>{" "}
        <span className="usa-tag usa-tag--big bg-primary-dark">
          #8450001171
        </span>
        <p className="usa-intro measure-5">
          Thank you for uploading your documents. Here are the results:
        </p>
        <ul>
          {parsedResults?.results?.map((result, idx) => (
            <li key={idx}>
              {result.value && (
                <>
                  {result.value.imagePath}:{""}
                  {result.value.isBlurry ? "blurry!" : "sharp"} (
                  {result.value.score})
                </>
              )}
              {result.reason && (
                <>
                  {result.reason.imagePath}:{""}
                  {result.reason.isBlurry ? "blurry!" : "sharp"} (
                  {result.reason.score})
                </>
              )}
            </li>
          ))}
        </ul>
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h4">Check your email</ProcessListHeading>
            <p className="margin-top-05">
              You’ll receive an email when the documents are scanned and sent.
              If we’re unable to read the files or an error occurs, you’ll need
              to upload them again.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h4">
              Await a decision on your claim
            </ProcessListHeading>
            <p>
              We will review your documents and provide a response within 5
              business days.
            </p>
          </ProcessListItem>
        </ProcessList>
      </div>
    </Layout>
  );
};

export default Confirmation;
