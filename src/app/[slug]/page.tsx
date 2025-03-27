import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { getVisitCount } from "../../lib/supabase";
import DateFormatter from "../_components/date-formatter";
import { Bio } from "../_components/bio";
import { TweetButton } from "../_components/tweet-button";
import { siteUrl, twitterHandle } from "../../lib/constants";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const visitCount = await getVisitCount();
  const title = post.title.replace("{visitCount}", visitCount.toString());
  const content = await markdownToHtml(post.content || "");
  const url = `${siteUrl}/${post.slug}`;
  const hashtags = post.hashtags;

  return (
    <main>
      <Container>
        <div className="flex flex-col gap-10">
          <Header />
          <article className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <h1 className="font-script text-blue-500 text-3xl">{title}</h1>
              <div className="text-lg">
                <DateFormatter dateString={post.date} />
              </div>
            </div>
            <PostBody content={content} />
          </article>
        </div>
        <div className="flex flex-col gap-10">
          <TweetButton
            url={url}
            text={title}
            via={twitterHandle}
            hashtags={hashtags}
          />
          <Bio />
        </div>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Next.js Blog Example with Markdown`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
