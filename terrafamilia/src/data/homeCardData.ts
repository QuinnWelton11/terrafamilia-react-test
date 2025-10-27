import type { LucideIcon } from "lucide-react";
import { GraduationCap, Users, UserPlus, Award } from "lucide-react";

interface HomeCardData {
  id: number;
  title: string;
  message: string;
  route: string;
  buttonText: string;
  icon: LucideIcon;
  isDynamic?: boolean; // Flag for cards that need database data
}

export const homeCardData: HomeCardData[] = [
  {
    id: 1,
    title: "Welcome",
    message:
      "Welcome to TerraFamilia — a community grounded in connection, respect, and shared purpose. Here, we come together to trade, learn, and grow as one global family, rooted in the spirit of unity and care for one another.",
    route: "/about-us",
    buttonText: "Learn More",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "The Commons",
    message:
      "Step into The Commons, the heart of TerraFamilia — a shared space for open exchange. Post, barter, share wisdom, and build meaningful connections in an environment built on trust, inclusivity, and cooperation.",
    route: "/the-commons",
    buttonText: "Visit Commons",
    icon: Users,
  },
  {
    id: 3,
    title: "Sign Up",
    message:
      "Join our growing community and become part of something real. Register to take part in The Commons — to post, trade, share ideas, and help cultivate a space where everyone belongs. Your voice, your values, and your privacy all matter here.",
    route: "/sso",
    buttonText: "Register",
    icon: UserPlus,
  },
  {
    id: 4,
    title: "Check out some of our active users",
    message: "", // Will be populated dynamically
    route: "/the-commons",
    buttonText: "View Profile",
    icon: Award,
    isDynamic: true,
  },
];
