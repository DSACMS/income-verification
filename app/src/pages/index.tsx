import {
  Accordion,
  Button,
  Dropdown,
  Fieldset,
  FileInput,
  FormGroup,
  Label,
  TextInput,
} from "@trussworks/react-uswds";

import Layout from "../components/Layout";

const Home = (props: { onSubmit: () => void }) => {
  return (
    <Layout>
      <div className="margin-y-5">
        <h1 className="mobile-lg:font-heading-2xl font-heading-xl">
          Upload documents
        </h1>
        <p className="usa-intro measure-4 mobile-lg:font-body-lg font-body-md">
          If you received a request for documents for your{" "}
          <strong>[state/territory]</strong> unemployment claim, you can upload
          them with this secure site.
        </p>

        <form className="usa-form usa-form--large">
          <FormGroup>
            <Label
              htmlFor="file-input-multiple"
              className="text-bold mobile-lg:font-body-lg"
            >
              Select one or more files
            </Label>
            <span className="usa-hint" id="file-input-multiple-hint">
              Files should be in PDF, JPG, PNG, TIFF, or HEIC format. Files must
              be under 10MB.
            </span>
            <FileInput
              id="file-input-multiple"
              name="file-input-multiple"
              aria-describedby="file-input-multiple-hint"
              multiple
            />

            <Accordion
              className="maxw-tablet margin-y-2"
              bordered
              items={[
                {
                  title: "Tips for scanning and taking photos",
                  content: (
                    <>
                      <p>
                        You can upload digital files, scans, or photos of
                        documents from a phone or tablet. Make sure your
                        documents are easy to read and include your name or
                        business name.
                      </p>

                      <p>
                        If you have an Apple or Android device, we recommend
                        scanning documents with built-in apps:
                      </p>

                      <ul className="usa-list">
                        <li>
                          <a
                            className="usa-link usa-link--external"
                            target="_blank"
                            rel="noreferrer"
                            href="https://support.apple.com/en-us/HT210336"
                          >
                            Scan documents with an iPhone or iPad
                          </a>
                        </li>
                        <li>
                          <a
                            className="usa-link usa-link--external"
                            target="_blank"
                            rel="noreferrer"
                            href="https://support.google.com/drive/answer/3145835?hl=en&co=GENIE.Platform%3DAndroid"
                          >
                            Scan documents with Google Drive
                          </a>
                        </li>
                      </ul>
                      <p>
                        Use a solid, dark background when scanning or taking
                        photos. Do not use a flash or alter the images in any
                        way.
                      </p>
                    </>
                  ),
                  expanded: false,
                  id: "accordion_2",
                  headingLevel: "h2",
                },
              ]}
            />
          </FormGroup>

          <FormGroup className="margin-top-4">
            <Fieldset>
              <legend className="usa-legend text-bold mobile-lg:font-body-lg">
                Help us match your documents to your&nbsp;application
              </legend>

              <Label className="margin-top-1" htmlFor="first_name">
                First name
              </Label>
              <div className="usa-hint">As it appears on your ID</div>
              <TextInput
                id="first_name"
                name="first_name"
                type="text"
                defaultValue=""
              />

              <Label className="margin-top-1" htmlFor="last_name">
                Last name
              </Label>
              <div className="usa-hint">As it appears on your ID</div>
              <TextInput
                id="last_name"
                name="last_name"
                type="text"
                defaultValue=""
              />

              <Label htmlFor="name">Social Security Number</Label>
              <div className="usa-hint">For example, 123 45 6789</div>
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
              You’ll receive an email when your documents have been processed
            </div>
            <TextInput id="email" name="email" type="email" defaultValue="" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Type of documents</Label>
            <Dropdown id="doc_type" name="doc_type">
              <option>Select document type</option>
              <option value="id">Identity verification</option>
              <option value="income">Proof of income</option>
              <option value="employment">Proof of employment</option>
              <option value="appeal">Appeal documents</option>
              <option value="other">Other</option>
            </Dropdown>
          </FormGroup>

          <Button type="button" onClick={props.onSubmit}>
            Submit documents
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Home;
