import { Code } from "bright";
import Link from "next/link";
import Image from "next/image";
import { MDXComponents } from "mdx/types";
import { Fira_Code } from "@next/font/google";
import { AnchorHTMLAttributes } from "react";
import Canvas from "@/app/components/Animation/Canvas";
import { focus } from "./focus";

const font = Fira_Code({ subsets: ["latin"] });

Code.theme = "github-dark-dimmed";
Code.codeClassName = font.className;
Code.titleClassName = font.className;
Code.lineNumbers = true;
Code.extensions = [focus];

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
  Canvas
};
