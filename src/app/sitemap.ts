import { BASE_PATH, BASE_URL } from "./libs/constant";
import { getPageURL } from "./libs/url";

export default async function sitemap() {
  const posts = await getPageURL();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}${BASE_PATH}${post.slug}`,
    lastModified: post.date
  }));
  return [{ url: BASE_URL, lastModified: new Date() }, ...postUrls];
}
