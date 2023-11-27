"use client";

import Link from "next/link";
import styled from "styled-components";
import { TitleContainer } from "../Container/TitleContainer";

const Nav = () => {
  return (
    <Section>
      <TitleContainer>
        <h1>다른 주제 더 보기</h1>
      </TitleContainer>
      <Container>
        <ul>
          <li>
            <Link href="/posts/programming">프로그래밍</Link>
          </li>
          <li>
            <Link href="/posts/movie">영화</Link>
          </li>
          <li>
            <Link href="/posts/etc">ETC</Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
};

export default Nav;

const Section = styled.section`
  padding: 1.5rem 0 4rem 0;
`;

const Container = styled.nav`
  ul {
    display: flex;
    flex-direction: column;
    gap: 0;
    li {
      border: 0;
      border-bottom: 1px solid ${({ theme }) => theme.grayColor};
      border-radius: 0;
      font-size: 3rem;
      font-weight: 200;
      margin: 0;
      a {
        display: block;
        width: 100%;
        height: 100%;
        padding: 2rem 3rem;
      }
      &:first-child {
        border-top: 1px solid ${({ theme }) => theme.grayColor};
      }
      &:hover {
        a {
          cursor: pointer;
          color: white;
          background-color: ${({ theme }) => theme.hlColor_dark};
        }
      }
    }
  }
`;
