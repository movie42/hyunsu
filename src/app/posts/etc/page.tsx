import { HomeContainer, Section } from "@/app/components";
import { getPageURL } from "@/app/libs/url";

const Programming = () => {
  const data = getPageURL();
  const etc = data
    .sort((a, b) => Number(a.date) - Number(b.date))
    .filter((post) => {
      return post.tags?.includes("etc");
    });

  return (
    <HomeContainer>
      <Section
        sectionTitle="ETC"
        posts={etc}
        baseUrl="/posts/etc"
      />
    </HomeContainer>
  );
};

export default Programming;
