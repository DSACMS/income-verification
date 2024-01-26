import { Button } from "@trussworks/react-uswds";
import { useRouter } from "next/router";
import IncomeVerificationStepIndicator from "src/components/IncomeVerificationStepIndicator";
import Layout from "src/components/Layout";

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`border-1px border-base-light radius-md padding-3 measure-6 ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </div>
  );
}

const Page = (props: { onTransferClick?: () => void }) => {
  const router = useRouter();

  const handleTransferClick = () => {
    if (props.onTransferClick) {
      props.onTransferClick();
    } else {
      router.push("/upload").catch(console.error);
    }
  };

  return (
    <Layout hideContact>
      <div className="margin-top-5 margin-bottom-15">
        <IncomeVerificationStepIndicator />
        <h1 className="mobile-lg:font-heading-2xl font-heading-xl">
          Verify your income
        </h1>
        <p className="usa-intro measure-4 mobile-lg:font-body-lg font-body-md">
          We need to verify your income to ensure you qualify for assistance and
          to calculate your benefits.
        </p>
        <Card className="margin-top-4 bg-accent-cool-lighter border-accent-cool-dark">
          <h2 className="margin-top-0 margin-bottom-05 font-heading-lg">
            Upload income documents
          </h2>

          <p>You can upload copies of your most recent paystubs.</p>

          <ul className="usa-list">
            <li>Pay stubs</li>
            <li>Employer letters</li>
            <li>Bank statements</li>
          </ul>
          <Button type="button" onClick={handleTransferClick}>
            Upload documents
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default Page;
