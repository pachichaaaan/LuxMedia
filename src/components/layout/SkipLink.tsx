import { chrome } from "@/content/site";

export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only fixed top-4 left-4 z-[100] rounded-pill bg-screenlight px-6 py-3 text-body text-midnight focus:not-sr-only"
    >
      {chrome.skipLink}
    </a>
  );
}
