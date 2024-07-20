"use client";

import { BASE_URL } from "@/app/libs/constant";
import Link from "next/link";
import { GitHub, Rss } from "react-feather";
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
        <Link href={`${BASE_URL}/rss.xml`}>
          <Rss />
        </Link>
        <Link
          href="https://github.com/movie42"
          className="github"
        >
          <GitHub />
        </Link>
      </LinkContainer>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1050;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  a {
    display: inline-block;
    font-size: 1.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.hlColor};
    padding: 0.5rem;
    &:hover {
      color: ${({ theme }) => theme.whiteColor};
      background-color: ${({ theme }) => theme.hlColor};
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
