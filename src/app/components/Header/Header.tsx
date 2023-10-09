"use client";

import { BASE_URL } from "@/app/libs/constant";
import Link from "next/link";
import styled from "styled-components";

const Header = () => {
  return (
    <Container>
      <h1>
        <Link
          className="logo"
          href={BASE_URL}
        >
          현수의 블로그
        </Link>
      </h1>
      <LinkContainer>
        <Link href={`${BASE_URL}/rss.xml`}>RSS</Link>
        <Link
          href="https://github.com/movie42"
          className="github"
        >
          Github
        </Link>
      </LinkContainer>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem;

  a {
    display: inline-block;
    font-size: 1.8rem;
    font-weight: 700;
    border: 2px solid ${({ theme }) => theme.hlColor};
    color: ${({ theme }) => theme.hlColor};
    padding: 0.5rem;
    border-radius: 0.5rem;
    &:hover {
      color: ${({ theme }) => theme.whiteColor};
      background-color: ${({ theme }) => theme.hlColor};
    }
    &:active {
      transform: scale(0.97);
    }
    &.logo {
      font-size: 2.5rem;
      border: 0;
      &:hover {
        color: ${({ theme }) => theme.hlColor_dark};
        background-color: unset;
      }
    }
    &.github {
      border: 2px solid ${({ theme }) => theme.basicColor};
      color: ${({ theme }) => theme.basicColor};
      &:hover {
        color: ${({ theme }) => theme.whiteColor};
        background-color: ${({ theme }) => theme.basicColor};
      }
    }
  }
`;

const LinkContainer = styled.div`
  display: flex;

  gap: 0.8rem;
`;
