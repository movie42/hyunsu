import { getAllPosts, getPost } from "./readFile";

export const getPageURL = () => {
  const data = getAllPosts().map(({ slug }) => {
    const file = getPost(slug);
    return {
      ...file
    };
  });

  return data;
};
