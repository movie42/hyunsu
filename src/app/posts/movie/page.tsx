import { HomeContainer, Section } from "@/app/components";
import { getPageURL } from "@/app/libs/url";

const Programming = () => {
  const data = getPageURL();
  const movie = data
    .sort((a, b) => Number(a.date) - Number(b.date))
    .filter((post) => {
      return post.tags?.includes("movie");
    });

  return (
    <HomeContainer>
      <Section
        sectionTitle="영화"
        posts={movie}
        baseUrl="/posts/movie"
      />
    </HomeContainer>
  );
};

export default Programming;
