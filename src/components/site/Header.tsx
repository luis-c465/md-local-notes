import NoteInfo from "#/note/NoteInfo";
import { Icons } from "#/site/icons";
import { ThemeToggle } from "#/site/ThemeToggle";
import { buttonVariants } from "#/ui/button";
import siteConfig from "~/config/site";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 w-full items-center space-x-5 sm:justify-between sm:space-x-0">
        <NoteInfo />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </a>

            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
