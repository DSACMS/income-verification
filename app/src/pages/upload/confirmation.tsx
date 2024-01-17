import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
} from "@trussworks/react-uswds";
import type { NextPage } from "next";
import Layout from "src/components/Layout";

const Confirmation: NextPage = () => {
  return (
    <Layout>
      <div className="margin-top-5">
        <h1 className="font-heading-2xl">We’re scanning your documents.</h1>
        <strong>Confirmation:</strong>{" "}
        <span className="usa-tag usa-tag--big bg-primary-dark">
          #8450001171
        </span>
        <p className="usa-intro measure-5">
          Thank you for uploading your documents.
        </p>
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h4">Check your email</ProcessListHeading>
            <p className="margin-top-05">
              You’ll receive an email when the documents are scanned and sent to
              your unemployment office. If we’re unable to read the files or an
              error occurs, you’ll need to upload them again.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h4">
              Await a decision on your claim
            </ProcessListHeading>
            <p>
              Your unemployment office will review your documents and provide a
              response within 5 business days.
            </p>
          </ProcessListItem>
        </ProcessList>
      </div>
    </Layout>
  );
};

export default Confirmation;
