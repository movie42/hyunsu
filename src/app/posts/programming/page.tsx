import { HomeContainer, Section } from "@/app/components";
import { getPageURL } from "@/app/libs/url";

const Programming = () => {
  const data = getPageURL();
  const programming = data
    .sort((a, b) => Number(a.date) - Number(b.date))
    .filter((post) => {
      return !post.tags?.includes("etc");
    });

  return (
    <HomeContainer>
      <Section
        sectionTitle="프로그래밍"
        posts={programming}
        baseUrl="/posts/programming"
      />
    </HomeContainer>
  );
};

export default Programming;
