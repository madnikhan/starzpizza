export type BannerType = "image" | "video";

export interface Banner {
  id: string;
  type: BannerType;
  url: string;
  title: string;
  subtitle?: string;
  order: number;
}
