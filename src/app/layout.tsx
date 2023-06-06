"use client";

import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "./registry";
import { GlobalStyle } from "./styles/globalStyle";

import localFont from "@next/font/local";
import { theme } from "./styles/theme";

export const SUIT = localFont({
  src: "../../public/font/SUIT-Variable.woff2"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={SUIT.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
