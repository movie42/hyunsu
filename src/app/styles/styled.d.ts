import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    basicColor: string;
    grayColor: string;
    grayColor_light: string;
    grayColor_dark: string;
    whiteColor: string;
    hlColor: string;
    hlColor_dark: string;
    hlColor_light: string;
    subColor: string;
    subColor_dark: string;
    subColor_light: string;
    compColor: string;
  }
}
