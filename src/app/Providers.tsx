"use client";

import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "./libs/registry";
import { theme } from "./styles/theme";

const Providers = (props: React.PropsWithChildren) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default Providers;
