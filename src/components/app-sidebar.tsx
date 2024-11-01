import { Link } from "react-router-dom";

import AddNewNote from "#/note/AddNew";
import { SearchForm } from "#/search-form";
import { Icons } from "#/site/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/ui/sidebar";
import siteConfig from "~/config/site";
import Content from "./sidebar/Content";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 ml-2" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>

        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <Content />
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <AddNewNote />
      </SidebarFooter>
    </Sidebar>
  );
}
