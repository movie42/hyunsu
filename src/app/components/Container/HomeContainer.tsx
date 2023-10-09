"use client";

import { styled } from "styled-components";

export const HomeContainer = styled.div`
  padding: 2rem;
  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    li {
      border: 1px solid ${({ theme }) => theme.grayColor_dark};
      border-radius: 1rem;
    }
  }
`;
