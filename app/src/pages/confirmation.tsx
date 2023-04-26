import {
  Alert,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
} from "@trussworks/react-uswds";
import type { NextPage } from "next";

import Layout from "../components/Layout";

const Confirmation: NextPage = () => {
  return (
    <Layout>
      <div className="margin-y-5">
        <h1 className="font-heading-2xl">We’re processing your documents.</h1>
        <strong>Confirmation:</strong> <span className="usa-tag usa-tag--big bg-primary-dark">#8450001171</span>

        <p className="usa-intro">You’re almost done. Here is what’s next.</p>


        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h4">Check your email</ProcessListHeading>
            <p className="margin-top-05">
              Once your documents have been processed, you will receive an email
              indicating whether your documents were uploaded successfully or if
              there were any errors.
              <Alert
                type="warning"
                headingLevel="h2"
                slim
                className="margin-top-2"
              >
                If an error occurs during the processing of your documents, you
                will need to send them again. The email notification will
                include more info about resolving any errors that may occur.
              </Alert>
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h4">
              Await a decision on your claim
            </ProcessListHeading>
            <p>
              If your documents are successfully processed, then{" "}
              <strong>[State/Territory]</strong> will review your documents and
              provide a response. If you have questions about your claim, please
              contact{" "}
              <a
                href="https://www.dol.gov/agencies/eta/contacts/ui"
                target="_blank"
                className="usa-link"
              >
                your state/territory unemployment office
              </a>
              .
            </p>
          </ProcessListItem>
        </ProcessList>
      </div>
    </Layout>
  );
};

export default Confirmation;
