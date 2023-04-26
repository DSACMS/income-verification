import { Header, Title } from "@trussworks/react-uswds";
import { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const Layout = ({ children }: Props): ReactElement => {
  return (
    <div>
      <Header basic={true}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>USDOL Demo</Title>
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
