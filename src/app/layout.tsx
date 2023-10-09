import localFont from "@next/font/local";
import { Metadata } from "next";
import Providers from "./Providers";
import { GlobalStyle } from "./styles/globalStyle";

export const SUIT = localFont({
  src: "../../public/font/SUIT-Variable.woff2"
});

export const metadata: Metadata = {
  title: {
    default: "현수의 블로그",
    template: `%s | 현수의 블로그`
  },
  description:
    "프론트엔드 개발자 고현수의 블로그입니다. 개발, 자바스크립 & 잡다한 이야기를 끄적거리는 곳입니다.",
  verification: {
    google:
      "google-site-verification=veIyQnpMzmYGRpL8GEjeQsflYmq9zJAVRpn5zVx16FY"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={SUIT.className}>
        <Providers>
          <GlobalStyle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
