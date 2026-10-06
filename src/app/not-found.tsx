import type { Metadata } from "next";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { StoryFrame } from "@/components/ui/StoryFrame";
import { story } from "@/content/story";
import { notFoundPage } from "@/content/site";

export const metadata: Metadata = {
  title: notFoundPage.meta.title,
  robots: { index: false },
};

/** An expired story: every segment empty, the message centered in the frame. */
export default function NotFound() {
  return (
    <section
      data-surface="night"
      className="page-grid min-h-svh place-content-center pt-[calc(var(--nav-height)+3rem)] pb-16"
    >
      <div className="col-span-2 col-start-2 md:col-span-2 md:col-start-4 lg:col-span-3 lg:col-start-5 xl:col-span-2 xl:col-start-6">
        <StoryFrame segments={story.length} tone="dusk" className="mx-auto max-h-[78svh]">
          <div className="absolute inset-0 grid place-content-center gap-6 p-6 text-center">
            <h1 data-page-title className="text-h3">
              {notFoundPage.message}
            </h1>
            <p>
              <TransitionLink href="/" className="link-inline">
                {notFoundPage.link}
              </TransitionLink>
            </p>
          </div>
        </StoryFrame>
      </div>
    </section>
  );
}
