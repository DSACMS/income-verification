import { Alert } from "@trussworks/react-uswds";
import type { NextPage } from "next";

import Layout from "../../components/Layout";

const Confirmation: NextPage = () => {
  return (
    <Layout hideContact>
      <div className="margin-top-5">
        <h1 className="font-heading-2xl">
          Your tax information has been transferred
        </h1>
        <Alert type="success" heading="Transfer complete" headingLevel="h2">
          Thank you for transferring your federal tax information to verify your
          income. We’ll use this information to verify your eligibility and
          calculate your weekly benefits.
        </Alert>
      </div>
    </Layout>
  );
};

export default Confirmation;
