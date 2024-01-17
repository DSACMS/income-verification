import { Button, Tag } from "@trussworks/react-uswds";
import Link from "next/link";
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

const Page = (props: { onTransferClick: () => void }) => {
  const router = useRouter();

  const handleTransferClick = () => {
    if (props.onTransferClick) {
      props.onTransferClick();
    } else {
      router.push("/verify-income/transfer").catch(console.error);
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
          We need to verify your income to ensure you qualify for Disaster
          Unemployment Assistance and to calculate your weekly benefits.
        </p>
        <Card className="margin-top-4 bg-accent-cool-lighter border-accent-cool-dark">
          <h2 className="margin-top-0 margin-bottom-05 font-heading-lg">
            Transfer your tax information from the IRS
          </h2>
          <Tag className="bg-accent-cool-dark">Recommended</Tag>

          <p>
            You can securely transfer information from your most recent federal
            tax return from the IRS. This takes about <strong>5 minutes</strong>{" "}
            and is the most accurate way to verify your income.
          </p>

          <p>
            <strong>You&rsquo;ll need to:</strong>
          </p>
          <ul className="usa-list">
            <li>
              Consent to sharing information about your business income and
              expenses
            </li>
            <li>Confirm the information from the IRS is correct </li>
          </ul>

          <Button type="button" onClick={handleTransferClick}>
            Transfer tax information
          </Button>
        </Card>

        <Card className="margin-top-4 bg-base-lightest">
          <h2 className="margin-top-0 font-heading-md">
            Upload income documents
          </h2>

          <p>
            You can upload copies of your most recent federal tax return with{" "}
            <strong>Schedule C, F, K-1, or SE attachments</strong>.
          </p>

          <p>
            If you don’t have a copy of your tax return, you can{" "}
            <a
              href="https://www.irs.gov/individuals/get-transcript"
              target="_blank"
            >
              request a transcript online
            </a>{" "}
            or provide documents showing your business income and expenses:
          </p>
          <ul className="usa-list">
            <li>Invoices with your name or company name </li>
            <li>Bank records, ledgers, or accounting statements </li>
            <li>Business license (state or federal employer ID numbers) </li>
            <li>1099-MISC or 1099-K forms</li>
          </ul>
          <Link className="usa-button usa-button--outline" href="/upload">
            Upload documents
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Page;
