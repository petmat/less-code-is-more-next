import Image from "next/image";

export function Intro() {
  return (
    <section>
      <h1 className="pb-10 md:pb-14 md:pt-4">
        <Image
          src="/assets/less-code-is-more.svg"
          alt="Less Code Is More"
          width={675}
          height={42}
        />
      </h1>
    </section>
  );
}
