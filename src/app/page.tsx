import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { getVisitCount } from "../lib/db";

export default async function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const visitCount = await getVisitCount();
  const heroTitle = heroPost.title.replace(
    "{visitCount}",
    visitCount.toString()
  );

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroTitle}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && (
          <MoreStories posts={morePosts} visitCount={visitCount} />
        )}
      </Container>
    </main>
  );
}
