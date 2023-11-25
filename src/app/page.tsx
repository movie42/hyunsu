import { HomeContainer, Nav, Section } from "./components";

import { getPageURL } from "./libs/url";

export default function Home() {
  const data = getPageURL();
  const recentBlog = data
    .sort((a, b) => Number(a.date) - Number(b.date))
    .slice(0, 4);

  return (
    <HomeContainer>
      <Section
        sectionTitle="최근에 쓴 글"
        posts={recentBlog}
        baseUrl="/posts"
      />
      <Nav />
    </HomeContainer>
  );
}
