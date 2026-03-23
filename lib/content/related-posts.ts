import type { Post } from "@/types/content";

export function getRelatedPosts(posts: Post[], currentPost: Post, limit = 3) {
  const scored = posts
    .filter(
      (candidate) =>
        candidate.id !== currentPost.id && candidate.status === "published"
    )
    .map((candidate) => {
      const sameCategory =
        candidate.category.slug === currentPost.category.slug ? 4 : 0;
      const overlappingTags = candidate.tags.filter((tag) =>
        currentPost.tags.some((currentTag) => currentTag.slug === tag.slug)
      ).length;
      const featuredBonus = candidate.featured ? 1 : 0;

      return {
        candidate,
        score: sameCategory + overlappingTags * 2 + featuredBonus
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return (
        new Date(right.candidate.publishedAt || 0).getTime() -
        new Date(left.candidate.publishedAt || 0).getTime()
      );
    });

  return scored.slice(0, limit).map((entry) => entry.candidate);
}
