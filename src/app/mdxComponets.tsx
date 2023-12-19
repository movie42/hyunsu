import Canvas from "@/app/components/Animation/Canvas";
import Quotation from "@/app/components/Quotation/Quotation";
import { Fira_Code } from "@next/font/google";
import { Code } from "bright";
import { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { ImageComment } from "./components/Comment/ImageComment";
import { fileIcons } from "./components/Post/fileIcon";
import { focus } from "./components/Post/focus";
import { Tabs } from "./components/Post/tabs/tabs";

const font = Fira_Code({ subsets: ["latin"] });

Code.theme = "github-dark-dimmed";
Code.codeClassName = font.className;
Code.titleClassName = font.className;
Code.lineNumbers = true;
Code.extensions = [focus, fileIcons];

export const mdxComponents: MDXComponents = {
  a: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <Link
        {...props}
        href={props.href || ""}
      >
        {children}
      </Link>
    );
  },
  img: ({ props }: any) => {
    return <Image {...props} />;
  },
  pre: Code,
  Quotation,
  Canvas,
  Tabs,
  ImageComment
};
