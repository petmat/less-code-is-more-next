import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import { getVisitCount } from "../lib/db";
import { PostPreview } from "./_components/post-preview";
import { Bio } from "./_components/bio";
import { VisitCounter } from "./_components/visit-counter";

export default async function Index() {
  const allPosts = await getAllPosts();

  const visitCount = await getVisitCount();

  return (
    <main>
      <Container>
        <Intro />
        <section className="flex flex-col gap-12">
          <Bio />
          <div className="flex flex-col gap-10">
            {allPosts.map((post) => {
              const title = post.title.replace(
                "{visitCount}",
                visitCount.toString()
              );

              return (
                <PostPreview
                  key={post.slug}
                  title={title}
                  date={post.date}
                  slug={post.slug}
                  excerpt={post.excerpt}
                />
              );
            })}
          </div>
        </section>
        <div className="flex flex-col items-center pt-8">
          <VisitCounter visitCount={visitCount} />
        </div>
      </Container>
    </main>
  );
}
