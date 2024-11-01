import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { Button } from "./button";
import { useSidebar } from "./sidebar";

export default function SidebarCollapse() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
      {open ? (
        <PanelRightCloseIcon className="size-4" />
      ) : (
        <PanelRightOpenIcon className="size-4" />
      )}
    </Button>
  );
}
