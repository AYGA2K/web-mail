import { Reply, ReplyAll, Forward, Archive, Trash2, Clock } from "lucide-react";
import { Button } from "./ui/button";

export function EmailView() {
  return (
    <div className="flex flex-1 flex-col rounded-md border p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">Your repository has been updated</h2>
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

      <div className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              GH
            </div>
            <div>
              <div className="font-medium">GitHub</div>
              <div className="text-sm text-muted-foreground">to me</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">10:30 AM (2 hours ago)</div>
        </div>

        <div className="py-6">
          <p>Hello,</p>
          <p className="mt-4">
            We've detected new commits to your repository "remix-email-app".
            Here's a summary of the changes:
          </p>
          {/* Email content would go here */}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t pt-4">
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
