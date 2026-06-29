export interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  links: LinkItem[];
}

export interface SectionItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  formatMode?: 'paragraph' | 'bullets'; // Add this configuration selector key
}

export interface DynamicSection {
  id: string;
  title: string;
  type: 'experience' | 'education' | 'projects' | 'skills' | 'awards' | 'certifications' | 'languages' | 'custom';
  items: SectionItem[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  sections: DynamicSection[];
}