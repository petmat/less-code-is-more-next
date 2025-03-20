import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <h1>
      <Link href="/">
        <Image
          src="/assets/less-code-is-more.svg"
          alt="Less Code Is More"
          width={300}
          height={19}
        />
      </Link>
    </h1>
  );
};

export default Header;
