"use client";

import { styled } from "styled-components";

export const PostContainer = styled.div`
  padding: 1.2rem 2rem;
  h1 {
    color: ${({ theme }) => theme.hlColor};
  }
  p {
    font-size: 1.3rem;
    line-height: 2.3rem;
  }

  p > img {
    width: 100%;
    max-width: 1020px;
  }
`;
