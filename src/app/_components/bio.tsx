import Image from "next/image";
import { FaGithub, FaTwitter, FaRssSquare } from "react-icons/fa";

export function Bio() {
  return (
    <div className="flex items-start gap-4">
      <Image
        src="/assets/blog/authors/matti-pic.png"
        alt={`Matti Petrelius`}
        width={60}
        height={60}
      />
      <div>
        <span className="mr-1">
          Written by{" "}
          <span className="font-script text-blue-500">Matti Petrelius</span> who
          is a fan of serverless and other cool things.
        </span>
        <div className="flex flex-row gap-1 whitespace-nowrap">
          <a
            href="https://twitter.com/mattipet"
            target="_blank"
            className="text-sky-500"
          >
            <FaTwitter />
          </a>
          <a
            href="https://github.com/petmat"
            target="_blank"
            className="text-neutral-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://lesscodeismore.dev/rss.xml"
            target="_blank"
            className="text-orange-300"
          >
            <FaRssSquare />
          </a>
        </div>
      </div>
    </div>
  );
}
