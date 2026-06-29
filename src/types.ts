export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    links: { platform: string; url: string }[];
  };
  summary: string;
  sections: DynamicSection[];
}

export interface DynamicSection {
  id: string;
  title: string;
  type: 'list' | 'text' | 'grid'; // list for jobs/education, text for summary, grid for skills
  items: SectionItem[];
}

export interface SectionItem {
  id: string;
  title?: string;       // Job title, Degree, Project Name
  subtitle?: string;    // Company, University
  dateRange?: string;   // e.g., "Jan 2022 - Apr 2025"
  description?: string; // Rich text / Bullet points
  tags?: string[];      // For skills or tech stacks
}