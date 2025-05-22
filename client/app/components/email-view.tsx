import { Reply, ReplyAll, Forward, Archive, Trash2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import type { Email } from "~/types/email";

interface EmailViewProps {
  email?: Email;
}

export function EmailView({ email }: EmailViewProps) {
  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select an email to view
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">{email.subject}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {email.sender.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{email.sender}</div>
              <div className="text-sm text-muted-foreground">to me</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{email.time}</div>
        </div>

        <div className="py-6">
          <p>Hello,</p>
          <p className="mt-4">{email.preview}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t pt-4">
        <Button variant="outline" className="gap-2">
          <Reply className="h-4 w-4" />
          Reply
        </Button>
        <Button variant="outline" className="gap-2">
          <ReplyAll className="h-4 w-4" />
          Reply All
        </Button>
        <Button variant="outline" className="gap-2">
          <Forward className="h-4 w-4" />
          Forward
        </Button>
      </div>
    </div>
  );
}
