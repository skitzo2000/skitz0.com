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

export interface SiteData {
  meta: SiteMeta;
  about?: string;
  social: SocialLink[];
  skills?: SkillCategory[];
  projects: Project[];
}

import siteJson from '../../content/site.json';

export const siteData: SiteData = siteJson as SiteData;

export function getSiteData(): SiteData {
  return siteData;
}
