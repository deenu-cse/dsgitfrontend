import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm mt-20">
      <p>
        Built for the DSA community.{" "}
        <a href="https://github.com/deenu-cse" className="text-[#1D9E75] hover:underline">
          GitHub
        </a>{" "}
        ·{" "}
        <Link href="/privacy" className="text-[#1D9E75] hover:underline">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <a href="https://chrome.google.com/webstore" className="text-[#1D9E75] hover:underline">
          Install Extension
        </a>
      </p>
    </footer>
  );
}