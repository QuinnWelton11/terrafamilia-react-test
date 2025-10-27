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
      "Welcome to TerraFamilia — a digital community grounded in connection and shared purpose. Here we can come together to Trade, Learn and Grow as one gloabl family, sharing and caring for each other.",
    route: "/about-us",
    buttonText: "Learn More",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "The Commons",
    message:
      "Step into The Commons, the heart of TerraFamilia — a shared space for open exchange. Share wisdom, skills, barter or volunteer. Build meaningful connections and share with your global family.",
    route: "/the-commons",
    buttonText: "Visit Commons",
    icon: Users,
  },
  {
    id: 3,
    title: "Sign Up",
    message:
      "Join the Terrafamilia community and help a digital commons. We are here to steward for our planet, not to own & control it.",
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
