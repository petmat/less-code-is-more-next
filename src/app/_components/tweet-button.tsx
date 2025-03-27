import { FaTwitter } from "react-icons/fa";

const objToQueryString = (obj: Record<string, string | undefined>) =>
  `${Object.values(obj).some((v) => v) ? "?" : ""}${Object.entries(obj)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;

export function TweetButton({
  url,
  text,
  via,
  hashtags,
}: {
  url: string;
  text: string;
  via: string;
  hashtags?: string;
}) {
  return (
    <a
      className="flex items-center gap-1 w-fit rounded-xs bg-sky-500 cursor-pointer py-px px-1"
      href={`https://twitter.com/intent/tweet${objToQueryString({
        url,
        text,
        via,
        hashtags,
      })}`}
    >
      <FaTwitter className="w-3 h-3" /> <span className="text-xs">Tweet</span>
    </a>
  );
}
