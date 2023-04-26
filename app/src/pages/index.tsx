import {
  Accordion,
  Button,
  Fieldset,
  FileInput,
  FormGroup,
  Label,
  TextInput,
} from "@trussworks/react-uswds";
import { AccordionItem } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";
import type { NextPage } from "next";

import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="margin-y-5">
        <h1>Upload documents</h1>
        <p className="usa-intro measure-5">
          If you’ve received a notice requesting additional documentation for
          your <strong>[State/Territory]</strong> unemployment claim, you can
          upload it here.
        </p>

        <Accordion
          className="maxw-tablet margin-bottom-4"
          items={[
            {
              title: "Accepted documents",
              content: "",
              expanded: false,
              id: "accordion_1",
              headingLevel: "h2",
            },
            {
              title: "Tips for scanning and taking photos",
              content: "",
              expanded: false,
              id: "accordion_2",
              headingLevel: "h2",
            },
          ]}
        />

        <form className="usa-form usa-form--large">
          <FormGroup>
            <Label htmlFor="file-input-multiple" className="text-bold">
              Select one or more files
            </Label>
            <span className="usa-hint" id="file-input-multiple-hint">
              Files should be in .pdf, .jpg, .png, or .heic format. Files must
              be less than 10MB each.
            </span>
            <FileInput
              id="file-input-multiple"
              name="file-input-multiple"
              aria-describedby="file-input-multiple-hint"
              multiple
            />
          </FormGroup>

          <FormGroup className="margin-top-4">
            <Fieldset>
              <legend className="usa-legend text-bold">
                Help us match your documents to your application
              </legend>

              <Label className="margin-top-1" htmlFor="name">
                Full name
              </Label>
              <div className="usa-hint">Legally as it appears on your ID.</div>
              <TextInput id="name" name="name" type="text" defaultValue="" />

              <Label htmlFor="name">Social Security Number</Label>
              <div className="usa-hint">For example, 123 45 6789.</div>
              <TextInput
                id="ssn"
                name="ssn"
                type="text"
                defaultValue=""
                inputMode="numeric"
                placeholder="___ __ ____"
                pattern="^(?!(000|666|9))\d{3} (?!00)\d{2} (?!0000)\d{4}$"
                className="usa-masked"
                inputSize="medium"
              />
            </Fieldset>

            <Label htmlFor="email">Email address</Label>
            <div className="usa-hint">
              You will receive an email to this address when your documents have
              been successfully processed.
            </div>
            <TextInput id="email" name="email" type="email" defaultValue="" />
          </FormGroup>

          <Button type="submit">Submit documents</Button>
        </form>
      </div>
    </Layout>
  );
};

export default Home;
