import {
  Accordion,
  Button,
  ErrorMessage,
  FileInput,
  Form,
  Label,
} from "@trussworks/react-uswds";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import Layout from "src/components/Layout";

const FILE_TYPES = [
  { label: "JPEG", mimetype: "image/jpeg" },
  { label: "PNG", mimetype: "image/png" },
  { label: "WEBP", mimetype: "image/webp" },
  { label: "AVIF", mimetype: "image/avif" },
  { label: "HEIC", mimetype: "image/heic" },
  { label: "TIFF", mimetype: "image/tiff" },
];

const ENGINE_OPTIONS = [
  { value: "ocr", label: "OCR (Optical Character Recognition)" },
  { value: "blur", label: "Blur" },
];

const list = new Intl.ListFormat("en", { type: "disjunction" });
// TODO: This limit was chosen arbitrarily; once this is no longer a demo,
// we should choose a limit that is based on actual system restrictions.
const MAX_FILE_SIZE_MB = 5; // 5MB = 5,000,000 bytes

const formatter = new Intl.NumberFormat("en", {
  style: "unit",
  unit: "megabyte",
});

const Home = (props: { onSubmit?: () => void }) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [selectedEngine, setSelectedEngine] = useState<string>(
    ENGINE_OPTIONS[0].value
  );
  const router = useRouter();

  // https://github.com/trussworks/react-uswds/issues/2399
  useEffect(() => {
    const instructions = document.querySelector(
      ".usa-file-input__instructions"
    );
    if (instructions) {
      instructions.innerHTML = "Select or drop files here";
    }
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const errors: string[] = [];

    setDisableSubmit(false);

    if (files) {
      Array.from(files).forEach((file, index) => {
        if (file.size > MAX_FILE_SIZE_MB * 1_000_000) {
          errors[index] =
            file.name +
            " is too large (greater than " +
            formatter.format(MAX_FILE_SIZE_MB) +
            ").";
          setDisableSubmit(true);
        } else {
          errors[index] = "";
          // Everything's fine!
        }
      });
    }

    setErrorMessages(errors);
  };

  const onEngineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEngine(event.target.value);
  };

  const onSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (props.onSubmit) {
      props.onSubmit();
      return;
    }

    const target = e.target as typeof e.target & {
      fileInputMultiple: { files: FileList };
      engineSelect: { value: string };
    };

    const fileInput = target.fileInputMultiple;

    if (fileInput) {
      const { files } = fileInput;
      const body = new FormData();

      Object.values(files).forEach((file) => {
        body.append(file.name, file);
      });

      fetch("/api/upload?engine=blur", {
        method: "POST",
        body,
      })
        .then((response) => response.json())
        .then((results) => {
          router
            .push(
              {
                pathname: "/upload/confirmation",
                query: { results: JSON.stringify(results) },
              },
              "/upload/confirmation"
            )
            .catch(console.error);
        })
        .catch(console.error);
    }
  };

  return (
    <Layout>
      <div className="margin-y-5">
        <h1 className="mobile-lg:font-heading-2xl font-heading-xl">
          Upload documents
        </h1>
        <p className="usa-intro measure-4 mobile-lg:font-body-lg font-body-md">
          If you received a request for documents for your{" "}
          <strong>[state/territory]</strong> benefits, you can upload them with
          this secure site.
        </p>

        <Form className="usa-form usa-form--large" onSubmit={onSubmit}>
          <Label
            htmlFor="fileInputMultiple"
            className="text-bold mobile-lg:font-body-lg"
          >
            Select files or photos
          </Label>
          <span className="usa-hint" id="file-input-multiple-hint">
            Files should be in {list.format(FILE_TYPES.map((t) => t.label))}{" "}
            format. Files must be under {formatter.format(MAX_FILE_SIZE_MB)}.
          </span>
          <FileInput
            crossOrigin="true"
            id="fileInputMultiple"
            name="fileInputMultiple"
            aria-describedby="file-input-multiple-hint"
            accept={FILE_TYPES.map((t) => t.mimetype).join(", ")}
            onChange={onFileChange}
            multiple
          />
          <Label
            htmlFor="engineSelect"
            className="text-bold mobile-lg:font-body-lg margin-top-2"
          >
            Select engine
          </Label>
          <select
            className="usa-select"
            id="engineSelect"
            name="engineSelect"
            onChange={onEngineChange}
            value={selectedEngine}
          >
            {ENGINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                      documents from a phone or tablet. Make sure your documents
                      are easy to read and include your name or business name.
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
                      photos. Do not use a flash or alter the images in any way.
                    </p>
                  </>
                ),
                expanded: false,
                id: "accordion_2",
                headingLevel: "h2",
              },
            ]}
          />
          <ErrorMessage>
            {errorMessages.map(
              (message, index) => message && <p key={index}>{message}</p>
            )}
          </ErrorMessage>
          <Button type="submit" disabled={disableSubmit}>
            Submit documents
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default Home;
