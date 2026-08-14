export type DevelopmentMedia = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  type: "tattoo" | "drawing";
  objectPosition?: string;
  objectFit?: "cover" | "contain";
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
  },
  {
    src: "/client-media/eagle-tattoo.jpg",
    width: 1536,
    height: 1360,
    alt: "Black-and-grey eagle tattoo wrapping around an arm.",
    title: "Eagle",
    type: "tattoo",
    objectPosition: "55% 50%",
  },
  {
    src: "/client-media/anatomical-figure-tattoo.jpg",
    width: 1536,
    height: 1199,
    alt: "Black-and-grey skeletal anatomical figure tattoo on an arm.",
    title: "Anatomical figure",
    type: "tattoo",
    objectPosition: "51% 48%",
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
  },
] as const satisfies readonly DevelopmentMedia[];

export const developmentHeroTattoos = developmentTattoos.slice(0, 3);

export const developmentDrawings = [
  {
    src: "/client-media/dark-fantasy-sketch.jpg",
    width: 1536,
    height: 1395,
    alt: "Sketchbook spread of dark-fantasy characters drawn in black, red, and blue ink.",
    title: "Dark-fantasy study",
    type: "drawing",
  },
  {
    src: "/client-media/classical-portrait-study.jpg",
    width: 1265,
    height: 1536,
    alt: "Graphite study of layered classical faces with a restrained gold accent.",
    title: "Classical portrait study",
    type: "drawing",
  },
  {
    src: "/client-media/veiled-face-study.jpg",
    width: 1249,
    height: 1536,
    alt: "Grayscale drawing of a veiled face with folded fabric.",
    title: "Veiled figure study",
    type: "drawing",
  },
  {
    src: "/client-media/religious-composition.jpg",
    width: 673,
    height: 1536,
    alt: "Tall colored classical and religious composition with angels, figures, and white star forms.",
    title: "Classical composition",
    type: "drawing",
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
} as const satisfies DevelopmentMedia;
