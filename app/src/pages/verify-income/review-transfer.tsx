import { Alert, Button, Fieldset, Radio, Table } from "@trussworks/react-uswds";
import { useRouter } from "next/router";
import { useState } from "react";
import IncomeVerificationStepIndicator from "src/components/IncomeVerificationStepIndicator";

import Layout from "../../components/Layout";

function TableHead() {
  return (
    <thead>
      <tr>
        <th scope="col">Field</th>
        <th scope="col" className="text-right">
          Your tax information
        </th>
      </tr>
    </thead>
  );
}

function Cell(props: { children: React.ReactNode }) {
  return <td className="text-right font-family-mono">{props.children}</td>;
}

const Page = () => {
  const router = useRouter();
  const [accuracyAnswer, setAccuracy] = useState<string | null>(null);

  return (
    <Layout hideContact>
      <div className="margin-top-5 margin-bottom-15">
        <IncomeVerificationStepIndicator />
        <h1 className="mobile-lg:font-heading-2xl font-heading-xl">
          Review your tax information
        </h1>
        <p className="usa-intro measure-5 mobile-lg:font-body-lg font-body-md">
          Below is the information we received from the IRS. Please review it
          carefully before continuing as we’ll use this information to calculate
          your weekly benefits.
        </p>

        <h2 className="font-heading-lg">Taxpayer</h2>

        <Table striped fullWidth className="maxw-tablet">
          <TableHead />
          <tbody>
            <tr>
              <th scope="row">First name</th>
              <Cell>John</Cell>
            </tr>
            <tr>
              <th scope="row">Last name</th>
              <Cell>Doe</Cell>
            </tr>
            <tr>
              <th scope="row">Employer Identification Number (EIN)</th>
              <Cell>12-3456789</Cell>
            </tr>
            <tr>
              <th scope="row">Filing status</th>
              <Cell>Single</Cell>
            </tr>
          </tbody>
        </Table>

        <h2 className="font-heading-lg margin-top-6">
          2022: Schedule C (Form 1040)
        </h2>

        <Table striped fullWidth className="maxw-tablet">
          <TableHead />
          <tbody>
            <tr>
              <th scope="row">Gross receipts or sales</th>
              <Cell>$32,450</Cell>
            </tr>
            <tr>
              <th scope="row">Gross income</th>
              <Cell>$10,022</Cell>
            </tr>
            <tr>
              <th scope="row">Total expenses</th>
              <Cell>$22,428</Cell>
            </tr>
            <tr>
              <th scope="row">Net profit or loss</th>
              <Cell>$9,022</Cell>
            </tr>
          </tbody>
        </Table>

        <h2 className="font-heading-lg margin-top-6">
          2022: Schedule F (Form 1040)
        </h2>

        <Alert headingLevel="h3" type="info" className="maxw-tablet" slim>
          We did not receive Schedule F data with your 2022 Form 1040 tax
          filing.
        </Alert>

        <Table striped fullWidth className="maxw-tablet">
          <TableHead />
          <tbody>
            <tr>
              <th scope="row">Gross income</th>
              <Cell>--</Cell>
            </tr>
            <tr>
              <th scope="row">Total expenses</th>
              <Cell>--</Cell>
            </tr>
            <tr>
              <th scope="row">Net farm profit or loss</th>
              <Cell>--</Cell>
            </tr>
            <tr>
              <th scope="row">Gross income (accrual method)</th>
              <Cell>--</Cell>
            </tr>
          </tbody>
        </Table>

        <h2 className="font-heading-lg margin-top-6">
          2022: Schedule K (Form 1040)
        </h2>

        <Alert headingLevel="h3" type="info" className="maxw-tablet" slim>
          We did not receive Schedule K data with your 2022 Form 1040 tax
          filing.
        </Alert>

        <Table striped fullWidth className="maxw-tablet">
          <TableHead />
          <tbody>
            <tr>
              <th scope="row">Partner’s share of profit, loss, and capital</th>
              <Cell>--</Cell>
            </tr>
            <tr>
              <th scope="row">Current year net income (loss)</th>
              <Cell>--</Cell>
            </tr>
          </tbody>
        </Table>

        <Fieldset
          legend="Is this information correct? "
          className="maxw-tablet margin-y-6"
          legendStyle="large"
        >
          <Radio
            id="review-correct"
            name="accuracy"
            value="correct"
            tile
            label="Yes, this is correct"
            labelDescription="Select this option only if everything looks correct."
            onChange={(e) => {
              setAccuracy(e.target.value);
            }}
          />
          <Radio
            id="review-incorrect"
            name="accuracy"
            value="incorrect"
            tile
            label="No, this is inaccurate or incomplete"
            labelDescription="Select this option if anything in the data is wrong or missing. You will be able to upload documents to verify your income instead."
            onChange={(e) => {
              setAccuracy(e.target.value);
            }}
          />
        </Fieldset>

        {accuracyAnswer === "correct" && (
          <Button
            type="submit"
            className="margin-right-3 margin-bottom-2"
            onClick={() => {
              router
                .push("/verify-income/transfer-complete")
                .catch(console.error);
            }}
          >
            Transfer now
          </Button>
        )}
        {accuracyAnswer && (
          <Button
            type="button"
            secondary
            onClick={() => {
              router.push("/").catch(console.error);
            }}
          >
            Do not transfer
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Page;
