import { Icon, IconList, IconListContent, IconListIcon, IconListItem, ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import type { NextPage } from "next";



import Layout from "../components/Layout";


const Confirmation: NextPage = () => {
  return (
    <Layout>
      <div className="margin-y-5">
        <h1 className="font-heading-2xl">We’re processing your documents.</h1>
        <strong>Confirmation:</strong>{" "}
        <span className="usa-tag usa-tag--big bg-primary-dark">
          #8450001171
        </span>
        <p className="usa-intro measure-5">
          You’ll receive an email once your documents are processed and your
          unemployment office receives them.
        </p>
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h4">Check your email</ProcessListHeading>
            <p className="margin-top-05">
              We’ll let you know if we can process your documents successfully.
              If we’re unable to read the documents or an error occurs, you’ll
              need to upload them again.
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
            <p>
              If you have other questions about your claim, please contact:{" "}
            </p>

            <IconList>
              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.AccountBalance />
                </IconListIcon>
                <IconListContent>
                  <a
                    href="https://www.dol.gov/agencies/eta/contacts/ui"
                    target="_blank"
                    className="usa-link usa-link--external"
                  >
                    State Workforce Agency Name
                  </a>
                </IconListContent>
              </IconListItem>

              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.Phone />
                </IconListIcon>
                <IconListContent>
                  <a href="tel:1-800-XXX-XXXX" className="usa-link">
                    1-800-XXX-XXXX
                  </a>
                </IconListContent>
              </IconListItem>

              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.MailOutline />
                </IconListIcon>
                <IconListContent>
                  <a
                    href="mailto:workforce-agency@state.gov"
                    className="usa-link"
                  >
                    workforce-agency@state.gov
                  </a>
                </IconListContent>
              </IconListItem>
            </IconList>
          </ProcessListItem>
        </ProcessList>
      </div>
    </Layout>
  );
};

export default Confirmation;