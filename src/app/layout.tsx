import StyledComponentsRegistry from "./registry";
import { GlobalStyle } from "./styles/globalStyle";

import localFont from "@next/font/local";

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
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
