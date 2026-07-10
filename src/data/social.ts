export interface SocialPlatformOption {
  label: string;
  value: string;
  prefix: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  // --- Professional & Code ---
  { label: "GitHub", value: "GitHub", prefix: "github.com/" },
  { label: "LinkedIn", value: "LinkedIn", prefix: "linkedin.com/in/" },
  { label: "GitLab", value: "GitLab", prefix: "gitlab.com/" },
  { label: "Stack Overflow", value: "StackOverflow", prefix: "stackoverflow.com/users/" },
  
  // --- Design & Creative ---
  { label: "Behance", value: "Behance", prefix: "behance.net/" },
  { label: "Dribbble", value: "Dribbble", prefix: "dribbble.com/" },
  { label: "Figma", value: "Figma", prefix: "figma.com/@" },
  
  // --- Social & Media ---
  { label: "X / Twitter", value: "X", prefix: "x.com/" },
  { label: "YouTube", value: "YouTube", prefix: "youtube.com/@" },
  { label: "Medium", value: "Medium", prefix: "medium.com/@" },
  { label: "Dev.to", value: "DevTo", prefix: "dev.to/" },
  { label: "Hashnode", value: "Hashnode", prefix: "hashnode.dev/@" },
  { label: "Instagram", value: "Instagram", prefix: "instagram.com/" },
  { label: "Facebook", value: "Facebook", prefix: "facebook.com/" },
  
  // --- Portfolio / Catch-All ---
  { label: "Portfolio", value: "Portfolio", prefix: "https://" }
];