export type Job = {
  id: string;
  company: string;
  logo: string;
  logoBackground: string;
  position: string;
  postedAt: string;
  contract: string;
  location: string;
  website: string;
  apply: string;
  description: string;
  requirements: {
    content: string;
    items: string[];
  };
  role: {
    content: string;
    items: string[];
  };
};

export type FilterOptions = {
  query?: string;
  location?: string;
  contract?: 'Full Time' | 'Part Time' | 'Freelance' | '';
  limit?: string;
  skip?: string;
};
