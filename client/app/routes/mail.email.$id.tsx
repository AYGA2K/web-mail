import { useParams } from "@remix-run/react";
import { EmailView } from "~/components/email-view";
import type { Email } from "~/types/email";

export default function EmailViewPage() {
  const { id } = useParams();
  
  const emails: Email[] = [
    {
      id: 1,
      starred: true,
      read: false,
      sender: "GitHub",
      subject: "Your repository has been updated",
      preview: "We've detected new commits to your repository...",
      time: "10:30 AM",
      labels: ["Work"],
    },
    {
      id: 2,
      starred: false,
      read: true,
      sender: "Twitter",
      subject: "New followers on your account",
      preview: "You have 5 new followers this week...",
      time: "Yesterday",
      labels: ["Social"],
    },
    {
      id: 3,
      starred: false,
      read: false,
      sender: "LinkedIn",
      subject: "New job opportunities matching your profile",
      preview: "We found 5 new jobs that match your skills...",
      time: "2:45 PM",
      labels: ["Work"],
    },
    {
      id: 4,
      starred: true,
      read: true,
      sender: "Slack",
      subject: "Daily digest: Your workspace updates",
      preview: "Here's what happened in your workspace today...",
      time: "11:00 AM",
      labels: ["Work"],
    },
    {
      id: 5,
      starred: false,
      read: false,
      sender: "Amazon AWS",
      subject: "Your AWS bill for this month",
      preview: "Your AWS usage statement for the current billing period is now available...",
      time: "9:15 AM",
      labels: ["Work", "Important"],
    },
    {
      id: 6,
      starred: true,
      read: false,
      sender: "Spotify",
      subject: "New Release from Your Favorite Artist",
      preview: "Check out the latest album from an artist you follow...",
      time: "Yesterday",
      labels: ["Entertainment"],
    },
    {
      id: 7,
      starred: false,
      read: true,
      sender: "Netflix",
      subject: "New Shows Added to Your List",
      preview: "We've added new shows that match your interests...",
      time: "2 days ago",
      labels: ["Entertainment"],
    },
    {
      id: 8,
      starred: false,
      read: false,
      sender: "Docker",
      subject: "Security Alert: Container Vulnerability",
      preview: "Important security update for your Docker images...",
      time: "1:20 PM",
      labels: ["Work", "Security"],
    },
    {
      id: 9,
      starred: true,
      read: true,
      sender: "Medium",
      subject: "Weekly Reading Digest",
      preview: "Top stories in software development and technology...",
      time: "3:00 PM",
      labels: ["Reading"],
    },
    {
      id: 10,
      starred: false,
      read: false,
      sender: "NPM",
      subject: "Package Update Available",
      preview: "New versions available for your dependencies...",
      time: "11:45 AM",
      labels: ["Work", "Updates"],
    },
    {
      id: 11,
      starred: true,
      read: false,
      sender: "VS Code",
      subject: "Extension Updates Available",
      preview: "Updates available for your installed extensions...",
      time: "4:30 PM",
      labels: ["Work", "Updates"],
    },
    {
      id: 12,
      starred: false,
      read: true,
      sender: "Google Cloud",
      subject: "Cloud Function Execution Summary",
      preview: "Monthly summary of your cloud function usage...",
      time: "Yesterday",
      labels: ["Work", "Reports"],
    }
  ];
  
  const email = emails.find(e => e.id === parseInt(id || "0"));

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-auto">
      <EmailView email={email} />
    </div>
  );
}