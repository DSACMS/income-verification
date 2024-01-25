/* eslint-disable @next/next/no-img-element */
import {
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
    <div className="bg-error-dark text-white padding-y-05 text-center font-body-2xs padding-1 margin-bottom-1">
      This site is for example purposes only
    </div>

    <Header basic={true}>
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title className="desktop:margin-top-2">
            <div className="display-flex flex-align-center">
              <span className="margin-right-1">
                <img
                  className="width-5 desktop:width-10 text-bottom"
                  src="/logo.svg"
                  alt="Department of Labor, United States of America"
                />
              </span>
              <span className="font-sans-lg flex-fill">USDOL Demo</span>
            </div>
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
            <h2 className="font-heading-md margin-bottom-0">Contact us</h2>
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
                    State Workforce Agency Name
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
