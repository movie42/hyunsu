import { getAllPosts, getPost } from "../../../libs/readFile";

import { BASE_PATH, BASE_URL } from "@/app/libs/constant";

import { getData } from "@/app/libs/getData";

import { Metadata } from "next";

import DynamicPostContent from "@/app/components/Content/DynamicPostContent";

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getData({ params: params.slug });

  if (!post) {
    return {
      title: "페이지를 찾을 수 없습니다.",
      description: "페이지를 찾을 수 없습니다."
    };
  }

  return {
    title: `${post.title}`,
    description: `${post.content.slice(0, 100)}...`,
    alternates: { canonical: `${BASE_URL}${BASE_PATH}/${params.slug}` }
  };
}

const PostPage = ({ params: { slug } }: PostPageProps) => {
  const post = getData({ params: `${slug}` });

  return post?.content ? <DynamicPostContent post={post} /> : <div>페이지를 찾을 수 없습니다.</div>;
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
