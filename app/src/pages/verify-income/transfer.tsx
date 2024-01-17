import { Button } from "@trussworks/react-uswds";
import { useRouter } from "next/router";
import IncomeVerificationStepIndicator from "src/components/IncomeVerificationStepIndicator";

import Layout from "../../components/Layout";

const Page = () => {
  const router = useRouter();

  return (
    <Layout hideContact>
      <div className="margin-top-5 margin-bottom-15">
        <IncomeVerificationStepIndicator />
        <h1 className="mobile-lg:font-heading-2xl font-heading-xl">
          Consent to sharing your tax information
        </h1>
        <p className="usa-intro measure-4 mobile-lg:font-body-lg font-body-md">
          Do you want to share your federal tax information with the state of{" "}
          <em>[state name]</em> and the U.S. Department of Labor?
        </p>
        <p>
          By continuing, you agree to our{" "}
          <a
            href="https://www.irs.gov/privacy-disclosure/irs-privacy-policy"
            target="_blank"
          >
            Privacy Policy
          </a>{" "}
          and certify that you’re the person authorizing the disclosure of
          federal tax information. False statements may result in civil or
          criminal penalties.
        </p>
        <p className="margin-bottom-4">
          Your tax information will only be used to determine your eligibility
          for benefits. You can review the information we receive before
          including it in your unemployment claim.
        </p>
        <Button
          type="submit"
          className="margin-bottom-2"
          onClick={() => {
            router.push("/verify-income/review-transfer").catch(console.error);
          }}
        >
          Agree and continue
        </Button>
        <Button
          type="button"
          outline
          onClick={() => {
            router.push("/").catch(console.error);
          }}
        >
          Cancel
        </Button>
      </div>
    </Layout>
  );
};

export default Page;
