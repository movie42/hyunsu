import "styled-components";
import { theme } from "./theme";

type Theme = keyof typeof theme;
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
