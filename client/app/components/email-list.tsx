import { Star, Archive, Trash2, Mail, Clock } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Email } from "~/types/email";

interface EmailListProps {
  emails: Email[];
  onEmailSelect?: (emailId: number) => void;
}

export default function EmailList({ emails, onEmailSelect }: EmailListProps) {
  const handleEmailClick = (emailId: number) => {
    if (onEmailSelect) {
      onEmailSelect(emailId);
    }
  };

  return (
    <div className=" w-full h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id}
              className={`${email.read ? "bg-muted/50" : ""} cursor-pointer hover:bg-muted/80`}
              onClick={() => handleEmailClick(email.id)}
            >
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star
                    className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                </Button>
              </TableCell>
              <TableCell>
                {!email.read && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </TableCell>
              <TableCell className="font-medium">{email.sender}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={email.read ? "" : "font-semibold"}>
                    {email.subject}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    - {email.preview}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-muted-foreground">
                    {email.time}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
