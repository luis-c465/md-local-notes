import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { Button } from "./button";
import { useSidebar } from "./sidebar";

export default function SidebarCollapse() {
  const { open, setOpen } = useSidebar();

  const handleToggle = () => setOpen(!open);

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      {open ? (
        <PanelRightCloseIcon className="size-4" />
      ) : (
        <PanelRightOpenIcon className="size-4" />
      )}
    </Button>
  );
}
