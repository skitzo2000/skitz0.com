export interface SiteMeta {
  name: string;
  tagline: string;
  avatar: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface GitHubConfig {
  username: string;
  pinned: string[];
}

export interface CareerNode {
  id: string;
  type: 'role' | 'company' | 'skill' | 'project' | 'education' | 'certification';
  label: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  proficiency?: number;
  description?: string;
  url?: string;
}

export interface CareerEdge {
  source: string;
  target: string;
  type: 'worked-at' | 'used-skill' | 'built-with' | 'earned-at' | 'requires' | 'part-of';
}

export interface CareerData {
  nodes: CareerNode[];
  edges: CareerEdge[];
}

export interface SiteData {
  meta: SiteMeta;
  about?: string;
  social: SocialLink[];
  skills?: SkillCategory[];
  projects: Project[];
  github?: GitHubConfig;
}

import siteJson from '../../content/site.json';
import careerJson from '../../content/career-data.json';

export const siteData: SiteData = siteJson as SiteData;

export function getSiteData(): SiteData {
  return siteData;
}

export const careerData: CareerData = careerJson as CareerData;

export function getCareerData(): CareerData {
  return careerData;
}
