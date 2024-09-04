"use client";

import { styled } from "styled-components";

export const PostContainer = styled.div`
  padding: 1.2rem 2rem;
  max-width: 1080px;
  margin: 0 auto;
  .post-content {
    padding: 4rem 0;
    h1 {
      color: ${({ theme }) => theme.hlColor};
      font-size: 4.2rem;
      font-weight: 800;
      word-spacing: -2px;
      margin: 2rem 0;
    }
    h2 {
      font-size: 3.5rem;
      font-weight: 700;
      word-spacing: -2px;
      margin: 2rem 0;
    }
    h3 {
      font-size: 3rem;
      font-weight: 700;
      word-spacing: -2px;
      margin: 2rem 0;
    }
    h4 {
      font-size: 2.5rem;
      font-weight: 700;
      word-spacing: -2px;
      margin: 2rem 0;
    }

    a {
      display: block;
      color: ${({ theme }) => theme.hlColor};
    }

    p {
      font-size: 1.9rem;
      line-height: 3.2rem;
      word-spacing: -2px;
      padding-bottom: 3rem;
      a {
        display: inline;
        color: ${({ theme }) => theme.hlColor};
      }
      code {
        color: ${({ theme }) => theme.hlColor_light};
        background-color: ${({ theme }) => theme.grayColor_light};
        padding: 0.4rem;
        border-radius: 0.5rem;
      }
    }

    img {
      width: 100%;
      max-width: 1020px;
    }

    ol {
      margin-left: 2.2rem;
      li {
        list-style: auto;
        ul {
          margin: 0;
          margin-left: 1.2rem;
          li {
            list-style: disc;
            padding-left: 2rem;
          }
        }
      }
    }
    ul,
    ol {
      margin-bottom: 3rem;
      li {
        font-size: 1.8rem;
        line-height: 3rem;
        ul,
        ol {
          li {
            padding-left: 1rem;
          }
        }
      }
    }

    .remark {
      padding: 0;
      small {
        margin: 0;
        padding: 0;
      }
    }
    .embeded-video {
      width: 100%;
      margin: 0 auto;
      aspect-ratio: 16 / 9;
      iframe {
        width: 100%;
        height: 100%;
      }
    }

    blockquote {
      position: relative;
      word-break: keep-all;
      margin: 3rem 1.2rem;
      padding: 1rem 4rem;
      border-radius: 0.2rem;
      background-color: ${(props) => props.theme.grayColor_light};

      p {
        margin: 0;
        padding: 0;
      }
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 0.8rem;
        height: 100%;
        background-color: ${(props) => props.theme.hlColor_light};
        content: "";
      }
    }
    p + blockquote {
      margin-top: 0;
    }

    code {
      font-size: 1.6rem;
      letter-spacing: -0.01rem;
      div {
        &:hover {
          cursor: pointer;
          background-color: #111;
        }
      }
    }

    @media (max-width: 450px) {
      h1,
      h2,
      h3,
      h4,
      h5 {
        line-height: 1.2;
      }
      h1 {
        font-size: 3.8rem;
      }
      h2 {
        font-size: 3.4rem;
      }
      h3 {
        font-size: 3rem;
      }
      h4 {
        font-size: 2.4rem;
      }
      h5 {
        font-size: 1.8rem;
      }
    }
  }
  @media (max-width: 1400px) {
    .toc {
      display: none;
    }
  }
`;

export const TestContainer = styled.div`
  margin: 0;
  &.test-container {
    h1,
    h2,
    h3,
    h4,
    h5,
    a {
      display: inline-block;
      font-size: 3.5rem;
      font-weight: 900;
      padding: 0;
      margin: 0;
      line-height: 1.5;
    }
    ul li,
    ol li {
      font-size: 3.5rem;
      font-weight: 100;
      line-height: 1.5;
      margin: 0;
    }
    ol,
    ul {
      margin: 0;
      line-height: 1.5;
    }
    a {
      font-weight: 100;
      text-decoration: underline;
      line-height: 1.5;
    }
    p {
      display: inline-block;
      font-size: 3.5rem;
      font-weight: 100;
      padding: 0;
      margin: 0;
      line-height: 1.5;
      word-break: break-word;
    }
  }
`;

export const InfoContainer = styled.div`
  div {
    display: flex;
    gap: 1.4rem;
    span {
      font-size: 1.6rem;
    }
  }
`;
export const Title = styled.h1`
  color: ${({ theme }) => theme.hlColor};
  word-break: keep-all;
  font-size: 16rem;
  font-weight: 900;
  @media (max-width: 450px) {
    font-size: 4rem;
  }
`;
