import { Post } from "@/app/libs/readFile";
import { mdxComponents } from "@/app/mdxComponets";

import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import Giscus from "../Giscus/Giscus";
import { InfoContainer, PostContainer, Title } from "../Post/PostContainer";
import TOC from "../TOC/TOC";

const DynamicPostContent = ({ post }: { post: Post }) => {
  return (
    <PostContainer>
      <TOC />
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
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug]
            }
          }}
          components={mdxComponents}
        />
        <Giscus />
      </div>
    </PostContainer>
  );
};

export default DynamicPostContent;
