import { Code } from "bright";
import Link from "next/link";
import Image from "next/image";
import { MDXComponents } from "mdx/types";
import { Fira_Code } from "@next/font/google";
import { AnchorHTMLAttributes } from "react";
import Canvas from "@/app/components/Animation/Canvas";

const font = Fira_Code({ subsets: ["latin"] });

Code.theme = "github-dark-dimmed";
Code.codeClassName = font.className;
Code.titleClassName = font.className;
Code.lineNumbers = true;
Code.extensions = [
  {
    name: "lineNumbers",
    beforeHighlight: (props, annotations) => {
      if (annotations.length > 0) {
        return { ...props, lineNumbers: true };
      }
    }
  },
  {
    name: "mark",
    InlineAnnotation: ({ children, query }) => (
      <mark style={{ background: query }}>{children}</mark>
    ),
    MultilineAnnotation: ({ children, query }) => (
      <div style={{ background: query }}>{children}</div>
    )
  },
  {
    name: "focus",
    MultilineAnnotation: ({ children }) => (
      <div style={{ filter: "contrast(0.3)" }}>{children}</div>
    ),
    beforeHighlight: (props, focusAnnotations) => {
      if (focusAnnotations.length === 0) return props;

      const lineCount = props.code.split("\n").length;

      const ranges = focusAnnotations.flatMap((a) => a.ranges);

      let newRanges = [{ fromLineNumber: 1, toLineNumber: lineCount }];

      for (const range of ranges) {
        if (!("fromLineNumber" in range)) continue;

        const { fromLineNumber, toLineNumber } = range;
        newRanges = newRanges.flatMap((r) => {
          if (
            r.fromLineNumber > toLineNumber ||
            r.toLineNumber < fromLineNumber
          )
            return [r];
          if (
            r.fromLineNumber >= fromLineNumber &&
            r.toLineNumber <= toLineNumber
          )
            return [];
          if (
            r.fromLineNumber < fromLineNumber &&
            r.toLineNumber > toLineNumber
          )
            return [
              {
                fromLineNumber: r.fromLineNumber,
                toLineNumber: fromLineNumber - 1
              },
              {
                fromLineNumber: toLineNumber + 1,
                toLineNumber: r.toLineNumber
              }
            ];
          if (r.fromLineNumber < fromLineNumber)
            return [
              {
                fromLineNumber: r.fromLineNumber,
                toLineNumber: fromLineNumber - 1
              }
            ];
          if (r.toLineNumber > toLineNumber)
            return [
              {
                fromLineNumber: toLineNumber + 1,
                toLineNumber: r.toLineNumber
              }
            ];
          return [];
        });
      }

      const newAnnotations = props.annotations.filter(
        (a) => a.name !== "focus"
      );
      newAnnotations.push({
        name: "focus",
        ranges: newRanges
      });
      return { ...props, annotations: newAnnotations };
    }
  },
  {
    name: "title",
    beforeHighlight: (props, annotations) => {
      if (annotations.length > 0) {
        return { ...props, title: annotations[0].query };
      }
    }
  }
];

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
