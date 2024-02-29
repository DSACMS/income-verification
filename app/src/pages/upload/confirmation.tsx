import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
} from "@trussworks/react-uswds";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";

import type { ResponseData } from "../api/upload";

function formatImagePath(path: string) {
  return (path.match("([^/]+$)") || [])[0];
}

function generateBlurryIcon(isBlurry: boolean) {
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

const Confirmation: NextPage = () => {
  const router = useRouter();
  const results = router.query?.results;
  let parsedResults: ResponseData = { message: "" };

  if (results) {
    parsedResults = JSON.parse(results.toString() || "") as ResponseData;
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
        <ul className="padding-left-1">
          {parsedResults?.results?.map((result, idx) => (
            <li key={idx} className="usa-icon-list__item">
              {result.value && (
                <>
                  {generateBlurryIcon(result.value.isBlurry)}
                  <span className="usa-icon-list__content padding-top-2px">
                    {" "}
                    {formatImagePath(result.value.imagePath)}
                    {result.value.isBlurry ? " is blurry" : ""}
                  </span>
                </>
              )}
              {result.reason && (
                <>
                  {generateBlurryIcon(result.reason.isBlurry)}
                  <span className="usa-icon-list__content padding-top-2px">
                    {" "}
                    {formatImagePath(result.reason.imagePath)}
                    {result.reason.isBlurry ? " is blurry" : ""}
                  </span>
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
