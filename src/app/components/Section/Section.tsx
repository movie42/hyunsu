"use client";
import { HOME } from "@/app/libs/constant";
import { generateUrl } from "@/app/libs/generateUrl";
import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";
import { TitleContainer } from "../Container/TitleContainer";
import Post from "../Post/Post";

interface Post {
  slug?: string | undefined;
  content?: string | undefined;
  wordCount?: number | undefined;
  title?: string | undefined;
  description?: string | undefined;
  tags?: string[] | undefined;
  draft?: boolean | undefined;
  date?: string | undefined;
}
interface SectionProps {
  posts: Post[];
  sectionTitle: string;
  baseUrl?: string;
}

const Section = ({ posts, sectionTitle, baseUrl }: SectionProps) => {
  const location = usePathname();

  return (
    <Container>
      <TitleContainer>
        <h1>{sectionTitle}</h1>
      </TitleContainer>
      <ul className="post-container">
        {posts?.map((post, index) => {
          return (
            <React.Fragment key={index}>
              {post.slug && (
                <RecentPost
                  title={post.title}
                  date={post.date}
                  href={
                    location === HOME ? generateUrl({ slug: post.slug, tags: post.tags, baseUrl }) : `${baseUrl}/${post.slug}`
                  }
                  tags={post.tags}
                />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </Container>
  );
};

export default Section;

const Container = styled.section`
  h1 {
    font-size: 5rem;
    font-weight: 900;
    color: ${({ theme }) => theme.hlColor};
  }
  ul.post-container {
    display: grid;
    grid-template-columns: unset;
    gap: 0;
    li {
      border: 0;
      border-bottom: 1px solid ${({ theme }) => theme.grayColor};
      &:first-child {
        border-top: 1px solid ${({ theme }) => theme.grayColor};
      }
      border-radius: 0;
    }
  }
`;

const RecentPost = styled(Post)`
  box-sizing: border-box;
  min-height: 10rem;
  margin: 0;

  &:hover {
    background-color: ${(props) => props.theme.hlColor};

    a {
      color: ${(props) => props.theme.whiteColor};
      h3 {
        word-spacing: -0.2rem;
        font-weight: 900;
      }
    }
  }
  &:active {
    background-color: ${({ theme }) => theme.hlColor_dark};
  }
`;
