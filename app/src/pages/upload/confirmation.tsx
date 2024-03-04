import {
  IconList,
  IconListContent,
  IconListItem,
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
      <div className="margin-top-5 measure-5">
        <h1 className="font-heading-2xl">We have uploaded your documents.</h1>
        <strong>Confirmation:</strong>{" "}
        <span className="usa-tag usa-tag--big bg-primary-dark">
          #8450001171
        </span>
        <p className="usa-intro">
          Thank you for uploading your documents. Here are the results:
        </p>
        <div>
          <IconList className="padding-2 word-break-all">
            {parsedResults?.results?.map((result, idx) => (
              <IconListItem key={idx} className="usa-icon-list__item">
                {result.value && (
                  <>
                    {generateBlurryIcon(result.value.isBlurry)}
                    <IconListContent>
                      {" "}
                      {formatImagePath(result.value.imagePath)}
                      {result.value.isBlurry
                        ? " is blurry"
                        : " successfully uploaded."}
                    </IconListContent>
                  </>
                )}
                {result.reason && (
                  <>
                    {generateBlurryIcon(result.reason.isBlurry)}
                    <IconListContent>
                      {" "}
                      {formatImagePath(result.reason.imagePath)}
                      {result.reason.isBlurry
                        ? " is blurry"
                        : " successfully uploaded"}
                    </IconListContent>
                  </>
                )}
              </IconListItem>
            ))}
          </IconList>
        </div>
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
