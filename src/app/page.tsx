import "@/app/styles/globals.css";
import { getAllPosts, getPost } from "./libs/readFile";
import Post from "./components/Post";
import styled from "styled-components";

export default function Home() {
  const data = getPageURL();

  return (
    <div>
      <ul className="post-container">
        {data?.map(
          (post, index) =>
            post.slug && (
              <Post
                key={index}
                title={post.title}
                date={post.date}
                href={post.slug}
              />
            )
        )}
      </ul>
    </div>
  );
}

export const getPageURL = () => {
  const data = getAllPosts().map(({ slug }) => {
    const file = getPost(slug);
    return {
      ...file
    };
  });

  return data;
};
