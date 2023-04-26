import Link from "next/link";

function Footer() {
  return (
    <p className="text-center text-gray-200 bg-gray-900 p-3">
      Made by Zekaryas Tadele @{" "}
      <Link href="https://github.com/zekaryas1/thecodegen">Github</Link>
    </p>
  );
}

export default Footer;
