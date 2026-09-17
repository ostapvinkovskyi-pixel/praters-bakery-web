import { BakeryPage } from "@/components/bakery/bakery-page";
import { SiteHeader } from "@/components/bakery/site-header";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/components/scroll-scrub-scenes";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
        <BakeryPage />
      </main>
    </>
  );
}
