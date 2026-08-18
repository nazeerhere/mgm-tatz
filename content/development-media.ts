import type { GalleryStyleSlug } from "@/lib/gallery-filters";

export type DevelopmentMedia = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  type: "tattoo" | "drawing";
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  styleSlugs: readonly GalleryStyleSlug[];
  featured?: boolean;
};

export const developmentTattoos = [
  {
    src: "/client-media/tiger-tattoo.jpg",
    width: 1145,
    height: 1536,
    alt: "Black-and-grey tiger tattoo extending vertically along an arm.",
    title: "Tiger",
    type: "tattoo",
    objectPosition: "52% 50%",
    styleSlugs: ["black-grey", "illustrative", "animals"],
    featured: true,
  },
  {
    src: "/client-media/eagle-tattoo.jpg",
    width: 1536,
    height: 1360,
    alt: "Black-and-grey eagle tattoo wrapping around an arm.",
    title: "Eagle",
    type: "tattoo",
    objectPosition: "55% 50%",
    styleSlugs: ["black-grey", "illustrative", "animals"],
    featured: true,
  },
  {
    src: "/client-media/anatomical-figure-tattoo.jpg",
    width: 1536,
    height: 1199,
    alt: "Black-and-grey skeletal anatomical figure tattoo on an arm.",
    title: "Anatomical figure",
    type: "tattoo",
    objectPosition: "51% 48%",
    styleSlugs: ["black-grey", "illustrative", "dark-fantasy"],
    featured: true,
  },
  {
    src: "/client-media/illustrative-figures-tattoo.jpg",
    width: 265,
    height: 512,
    alt: "Vertical black-and-grey tattoo of two illustrative fantasy figures connected by flowing smoke.",
    title: "Illustrative figures",
    type: "tattoo",
    objectPosition: "50% 50%",
    objectFit: "contain",
    styleSlugs: ["black-grey", "illustrative", "dark-fantasy"],
    featured: true,
  },
] as const satisfies readonly DevelopmentMedia[];

export const developmentHeroTattoos = developmentTattoos.slice(0, 4);

export const developmentDrawings = [
  {
    src: "/client-media/dark-fantasy-sketch.jpg",
    width: 1536,
    height: 1395,
    alt: "Sketchbook spread of dark-fantasy characters drawn in black, red, and blue ink.",
    title: "Dark-fantasy study",
    type: "drawing",
    styleSlugs: ["illustrative", "anime-manga", "dark-fantasy"],
  },
  {
    src: "/client-media/classical-portrait-study.jpg",
    width: 1265,
    height: 1536,
    alt: "Graphite study of layered classical faces with a restrained gold accent.",
    title: "Classical portrait study",
    type: "drawing",
    styleSlugs: ["black-grey", "classical"],
  },
  {
    src: "/client-media/veiled-face-study.jpg",
    width: 1249,
    height: 1536,
    alt: "Grayscale drawing of a veiled face with folded fabric.",
    title: "Veiled figure study",
    type: "drawing",
    styleSlugs: ["black-grey", "classical"],
  },
  {
    src: "/client-media/religious-composition.jpg",
    width: 673,
    height: 1536,
    alt: "Tall colored classical and religious composition with angels, figures, and white star forms.",
    title: "Classical composition",
    type: "drawing",
    styleSlugs: ["illustrative", "dark-fantasy", "classical"],
  },
  {
    src: "/client-media/mechanical-character-sketch.jpg",
    width: 1536,
    height: 1441,
    alt: "Red-ink sketchbook drawing of a fantasy character seated beside a four-legged mechanical cannon.",
    title: "Mechanical character study",
    type: "drawing",
    objectFit: "contain",
    styleSlugs: ["illustrative", "anime-manga"],
  },
] as const satisfies readonly DevelopmentMedia[];

export const milesPortrait = {
  src: "/client-media/miles-portrait-source.jpg",
  width: 1040,
  height: 1536,
  alt: "Miles drawing at a workstation in the studio.",
  title: "Miles in the studio",
  type: "drawing",
  objectPosition: "50% 65%",
  styleSlugs: ["black-grey"],
} as const satisfies DevelopmentMedia;
