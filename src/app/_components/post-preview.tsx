import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function PostPreview({ title, date, excerpt, slug }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-script text-blue-500 text-xl leading-snug">
        <Link href={`/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="opacity-60 text-xs">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-base leading-relaxed">{excerpt}</p>
    </div>
  );
}
