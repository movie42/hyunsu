"use client";

import styled from "styled-components";

export const TitleContainer = styled.div`
  background-color: unset;
  padding: 2rem;
  h1 {
    font-size: 5rem;
    font-weight: 900;
    color: ${({ theme }) => theme.hlColor};
  }
`;
