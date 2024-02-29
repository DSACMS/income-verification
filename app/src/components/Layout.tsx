/* eslint-disable @next/next/no-img-element */
import {
  Alert,
  Header,
  Icon,
  IconList,
  IconListContent,
  IconListIcon,
  IconListItem,
  Title,
} from "@trussworks/react-uswds";

import { ReactElement } from "react";

type Props = {
  children: ReactElement;
  hideContact?: boolean;
};

const Layout = ({ children, hideContact }: Props): ReactElement => (
  <div>
    <Alert type={"error"} headingLevel={"h1"} className="usa-alert--emergency usa-alert--no-icon text-center">
      This website is experimental. Do not upload any personal identifiable information.
    </Alert>

    <Header className="usa-header usa-header--basic">
      <div className="usa-nav-container">
        <div className="usa-navbar usa-logo height-8">
          <img
            className="width-6"
            src="/logo.svg"
            alt="Department of ACME, United States of America"
          />
          <Title className="usa-logo__text padding-left-2">
            ACME Demo
          </Title>
        </div>
      </div>
    </Header>
    <main className="grid-container">
      <div className="grid-row">
        <div className="grid-col">{children}</div>
      </div>
      {!hideContact && (
        <div className="grid-row">
          <div className="grid-col border-top-1px padding-y-3 border-base-lighter">
            <h2 className="margin-bottom-0">Contact us</h2>
            <p className="margin-top-05 margin-bottom-3">
              For claim questions or help with this website, please contact:
            </p>

            <IconList>
              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.AccountBalance aria-label="Balance Sheet" />
                </IconListIcon>
                <IconListContent>
                  <a
                    href="https://www.dol.gov/agencies/eta/contacts/ui"
                    target="_blank"
                    className="usa-link usa-link--external"
                  >
                    ACME
                  </a>
                </IconListContent>
              </IconListItem>

              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.Phone aria-label="Phone Icon" />
                </IconListIcon>
                <IconListContent>
                  <a href="tel:1-800-XXX-XXXX" className="usa-link">
                    1-800-XXX-XXXX
                  </a>
                </IconListContent>
              </IconListItem>

              <IconListItem>
                <IconListIcon className="text-primary-dark">
                  <Icon.MailOutline aria-label="Mailbox" />
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
          </div>
        </div>
      )}
    </main>
  </div>
);

export default Layout;
