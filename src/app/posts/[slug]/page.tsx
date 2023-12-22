import { getAllPosts, getPost } from "../../libs/readFile";

import { BASE_PATH, BASE_URL } from "@/app/libs/constant";

import Giscus from "@/app/components/Giscus/Giscus";
import { InfoContainer, PostContainer, Title } from "@/app/components/Post/PostContainer";
import { getData } from "@/app/libs/getData";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { mdxComponents } from "../../mdxComponets";

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
    description: post.content,
    alternates: { canonical: `${BASE_URL}${BASE_PATH}/${params.slug}` }
  };
}

const PostPage = ({ params: { slug } }: PostPageProps) => {
  const post = getData({ params: `${slug}` });

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
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkToc],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
            }
          }}
          components={mdxComponents}
        />
        <Giscus />
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
