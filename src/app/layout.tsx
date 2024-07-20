import { Metadata } from "next";
import Providers from "./Providers";
import Header from "./components/Header/Header";
import { GlobalStyle } from "./styles/globalStyle";

export const metadata: Metadata = {
  title: {
    default: "현수의 블로그",
    template: `%s | 현수의 블로그`
  },
  icons: {
    icon: "/favicon.png"
  },
  description: "프론트엔드 개발자 고현수의 블로그입니다. 개발, 자바스크립 & 잡다한 이야기를 끄적거리는 곳입니다.",
  verification: {
    google: "veIyQnpMzmYGRpL8GEjeQsflYmq9zJAVRpn5zVx16FY"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          <GlobalStyle />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
