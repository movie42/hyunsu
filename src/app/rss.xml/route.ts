import Rss from "rss";

import { getPageURL } from "../libs/url";

const SITE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://hyunsu.info";

export async function GET() {
  const articles = await getPageURL();

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
      url: `${SITE_URL}${article.slug}`,
      guid: `${SITE_URL}${article.slug}`,
      date: article.date ? article.date : ""
    });
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
