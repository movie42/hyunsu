import { BASE_URL } from "./libs/constant";
import { generateUrl } from "./libs/generateUrl";
import { getPageURL } from "./libs/url";

export default async function sitemap() {
  const posts = await getPageURL();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}${generateUrl({ tags: post.tags, slug: post.slug })}`,
    lastModified: post.date
  }));
  return [{ url: BASE_URL, lastModified: new Date() }, ...postUrls];
}
