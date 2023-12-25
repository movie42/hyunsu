import { Code } from "bright";
import { collapse } from "../collapse/extension";
import { fileIcons } from "../fileIcon";
import { focus } from "../focus";
import { tabs } from "./extension";

/** @type {import("bright").Extension} */
const title = {
  name: "title",
  beforeHighlight: (props, annotations) => {
    if (annotations.length > 0) {
      return { ...props, title: annotations[0].query };
    }
  }
};

export function Tabs({ children }) {
  return (
    <Code
      children={children}
      extensions={[title, tabs, fileIcons, focus, collapse]}
    />
  );
}
