"use client";

import { ReactNode } from "react";
import styled from "styled-components";

interface QuotationProps {
  type: "speak" | "think";
  children: ReactNode;
}
const Quotation = ({ children, type }: QuotationProps) => {
  return (
    <Container>
      <blockquote className="block-quotation">
        <span className="quotes">{type === "speak" ? `“` : `‘`}</span>
        {children}
        <span className="quotes">{type === "speak" ? `”` : `’`}</span>
      </blockquote>
    </Container>
  );
};

export default Quotation;

const Container = styled.div`
  @font-face {
    font-family: "NotoSerifKR";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NotoSerifKR.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rem 0 12rem;

  blockquote.block-quotation {
    margin: 0;
    padding: 0;
    background-color: unset;
    font-size: 2.8rem;
    font-family: "NotoSerifKR ", serif;
    font-style: italic;
    color: ${({ theme }) => theme.basicColor};
    span.quotes {
      font-family: "Times New Roman", Times, serif;
      color: ${({ theme }) => theme.grayColor_dark};
      font-style: italic;
    }
    &:after {
      display: none;
    }
  }
`;
