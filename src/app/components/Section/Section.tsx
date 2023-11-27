"use client";
import styled from "styled-components";
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
  return (
    <Container>
      <TitleContainer>
        <h1>{sectionTitle}</h1>
      </TitleContainer>
      <ul className="post-container">
        {posts?.map((post, index) => {
          return (
            <>
              {post.slug && (
                <RecentPost
                  key={index}
                  title={post.title}
                  date={post.date}
                  href={`${baseUrl}/${post.slug}`}
                  tags={post.tags}
                />
              )}
            </>
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

const TitleContainer = styled.div`
  background-color: unset;
  padding: 2rem 0;
`;

const RecentPost = styled(Post)`
  box-sizing: border-box;
  min-height: 10rem;
  margin: 0;

  &:hover {
    background-color: ${(props) => props.theme.hlColor_dark};
    transform: scale(1);
    a {
      color: ${(props) => props.theme.whiteColor};
      h3 {
        word-spacing: -0.2rem;
        font-weight: 900;
        transition: all 0.2s ease-in-out;
      }
    }
    transition: all 0.2s ease-in-out;
  }
  &:active {
    transform: scale(0.96);
  }
`;
