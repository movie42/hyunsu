import { getAllPosts, getPost } from "../../libs/readFile";

import { BASE_PATH } from "@/app/libs/constant";

import { MDXRemote } from "next-mdx-remote/rsc";
import { getData } from "@/app/libs/getData";
import {
  InfoContainer,
  PostContainer,
  Title
} from "@/app/components/PostContainer";
import Link from "next/link";

interface PostPageProps {
  params: { slug: string };
}

const PostPage = ({ params: { slug } }: PostPageProps) => {
  const post = getData({ params: `${BASE_PATH}/${slug}` });

  return post?.content ? (
    <PostContainer>
      <InfoContainer>
        <Title>{post.title}</Title>
        <div>
          <span>{post.date}</span>
          <div>
            {post.tags.map((tag) => (
              <span>{tag}</span>
            ))}
          </div>
        </div>
        <Link href={"/"}>뒤로가기</Link>
      </InfoContainer>
      <div className="post-content">
        {/* @ts-expect-error Server Component */}
        <MDXRemote source={post.content} />
      </div>
    </PostContainer>
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
