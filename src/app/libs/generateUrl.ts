export const generateUrl = ({ slug = "404", baseUrl = "/posts", tags }: { slug?: string; tags?: string[]; baseUrl?: string }) => {
  if (!tags) {
    return "404";
  }
  if (tags.includes("etc")) return `${baseUrl}/etc/${slug}`;
  if (tags.includes("movie")) return `${baseUrl}/movie/${slug}`;
  return `${baseUrl}/programming/${slug}`;
};
