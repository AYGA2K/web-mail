import EmailList from "~/components/email-list";
import { EmailView } from "~/components/email-view";

export default function InboxPage() {
  return (
    <div className="flex flex-col">
      <div className="">
        <EmailList />
      </div>
      <div className="mt-auto flex items-center gap-2 border-t pt-4">
        <EmailView />
      </div>
    </div>
  );
}
