export interface Publisher {
  id: string;
  name: string;
  // logo: string;
}

export interface PublisherCategory {
  id: string;
  name: string;
  publishers: Publisher[];
}

export interface PublisherDetail {
  name: string;
  description?: string;
  founding_year?: number;
  location?: string;
}