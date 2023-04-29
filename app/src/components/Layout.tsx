/* eslint-disable @next/next/no-img-element */
import { Header, Title } from "@trussworks/react-uswds";
import { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const Layout = ({ children }: Props): ReactElement => {
  return (
    <div>
      <div className="bg-error-dark text-white padding-y-05 text-center font-body-2xs padding-1 margin-bottom-1">
        This site is for example purposes only. The document uploader can be
        integrated with an application or on a separate page.
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
      </main>
    </div>
  );
};

export default Layout;
