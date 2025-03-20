import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import strip from "strip-markdown";
import { z } from "zod";

const dataSchema = z.object({
  title: z.string(),
  date: z.string(),
  coverImage: z.string(),
  author: z.object({
    name: z.string(),
    picture: z.string(),
  }),
  ogImage: z.object({
    url: z.string(),
  }),
  hashtags: z.string().optional(),
});

const postsDirectory = join(process.cwd(), "_posts");

const buildExcerpt = (
  pruneLength: number,
  words: string[],
  excerpt: string
) => {
  const newExcerpt = `${excerpt} ${words[0]}`;
  if (newExcerpt.length > pruneLength) {
    return excerpt;
  }
  return buildExcerpt(pruneLength, words.slice(1), newExcerpt);
};

const getExcerptSmart = async (content: string) => {
  const pruneLength = 140;
  const result = await unified()
    .use(remarkParse)
    .use(strip)
    .use(remarkStringify)
    .process(content);
  const excerpt = result.toString();

  if (excerpt.length <= pruneLength) {
    return excerpt;
  }

  const words = excerpt.split(" ");

  return `${buildExcerpt(pruneLength, words, "")}...`;
};

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const excerpt = await getExcerptSmart(content);
  const parsedData = dataSchema.parse(data);

  return { ...parsedData, slug: realSlug, content, excerpt };
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = (await Promise.all(slugs.map((slug) => getPostBySlug(slug))))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
