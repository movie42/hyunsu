import Rss from "rss";

import { generateUrl } from "../libs/generateUrl";
import { getPageURL } from "../libs/url";

const SITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://hyunsu.info";

export function GET() {
  const articles = getPageURL();

  const feed = new Rss({
    title: "현수의 블로그",
    description: "개발 & 잡다한 이야기를 끄적이는 곳입니다.",
    feed_url: `${SITE_URL}/rss.xml`,
    site_url: SITE_URL,
    language: "kr"
  });

  articles.forEach((article) => {
    feed.item({
      title: article.title ? article.title : "",
      description: article.content ? `${article.content.slice(0, 100)}...` : "",
      url: `${SITE_URL}${generateUrl({ tags: article.tags, slug: article.slug })}`,
      guid: `${SITE_URL}${generateUrl({ tags: article.tags, slug: article.slug })}`,
      date: article.date ? article.date : ""
    });
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
