import { getAllPosts, getPost } from "../../libs/readFile";

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import { BASE_PATH } from "@/app/libs/constant";

import { MDXRemote } from "next-mdx-remote/rsc";

const PostPage = ({ params: { slug } }: Params) => {
  const post = getData({ params: `${BASE_PATH}/${slug}` });

  return post?.content ? (
    <MDXRemote source={post.content} />
  ) : (
    <div>페이지를 찾을 수 없습니다.</div>
  );
};

export default PostPage;

export const generateStaticParams = () => {
  const posts = getAllPosts().map(({ slug }) => {
    const file = getPost(slug);

    return {
      slug: file?.slug
    };
  });

  return posts;
};

export const getData = ({ params }: { params: string }) => {
  const [findPost] = getAllPosts()
    .map(({ slug }) => getPost(slug))
    .filter((value) => value?.slug === params);

  return findPost;
};
