import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  imageSrc: string;
  title: string;
  description: string;
}

export interface Testimonial {
  content: string;
  author: string;
}

export const features: Feature[] = [
  {
    icon: "gem",
    title: "Premium Materials",
    description: "We source only the finest gold, silver, and gemstones for our creations."
  },
  {
    icon: "paint-brush",
    title: "Custom Designs",
    description: "Your vision, brought to life with expert craftsmanship and attention to detail."
  },
  {
    icon: "heart",
    title: "Handcrafted With Love",
    description: "Each piece is meticulously crafted by skilled artisans with decades of experience."
  }
];

export const galleryItems: GalleryItem[] = [
  {
    imageSrc: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    title: "Celestial Gold Necklace",
    description: "Handcrafted 18k gold with diamonds"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1611652022419-a9419f74613c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    title: "Ethereal Diamond Ring",
    description: "1.2 carat diamond with platinum band"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    title: "Cascade Pearl Earrings",
    description: "Freshwater pearls with 14k gold details"
  }
];

export const testimonials: Testimonial[] = [
  {
    content: "MAYA created my dream engagement ring. The craftsmanship is exceptional, and the customer service was outstanding throughout the process.",
    author: "Jennifer M."
  },
  {
    content: "I commissioned a custom necklace for my wife's birthday. She was absolutely thrilled. The attention to detail and quality is unmatched.",
    author: "Michael R."
  },
  {
    content: "The earrings I ordered were even more beautiful than I imagined. The team at MAYA worked with me to create something truly unique.",
    author: "Sarah L."
  }
];
