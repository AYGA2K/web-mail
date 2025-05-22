import {
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  Archive,
  AlertCircle,
  Mail,
  Plus
} from "lucide-react";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Button variant="ghost" className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Web Mail</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Inbox className="h-4 w-4" />
              Inbox
              <span className="ml-auto 
                flex h-6 w-6 items-center justify-center rounded-full
                bg-primary text-xs text-primary-foreground">
                12
              </span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Send className="h-4 w-4" />
              Sent
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Trash2 className="h-4 w-4" />
              Trash
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
