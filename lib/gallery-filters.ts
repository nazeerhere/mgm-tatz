import type { PortfolioType } from "@/lib/portfolio";

export const galleryStyleOptions = [
  { value: "all", label: "All" },
  { value: "black-grey", label: "Black & Grey" },
  { value: "illustrative", label: "Illustrative" },
  { value: "anime-manga", label: "Anime / Manga" },
  { value: "dark-fantasy", label: "Dark Fantasy" },
  { value: "classical", label: "Classical" },
  { value: "animals", label: "Animals & Nature" },
] as const;

export type GalleryStyleSlug = Exclude<
  (typeof galleryStyleOptions)[number]["value"],
  "all"
>;
export type GalleryStyleFilter = (typeof galleryStyleOptions)[number]["value"];
export type GalleryTypeFilter = "all" | "tattoo" | "drawing";
export type GallerySort = "featured" | "newest";
export const GALLERY_PAGE_SIZE = 6;
export type GalleryFilters = {
  type: GalleryTypeFilter;
  style: GalleryStyleFilter;
  sort: GallerySort;
};

export function parseGalleryFilters(params: {
  type?: string | string[];
  style?: string | string[];
  sort?: string | string[];
  page?: string | string[];
}) {
  const typeValue = Array.isArray(params.type) ? params.type[0] : params.type;
  const styleValue = Array.isArray(params.style)
    ? params.style[0]
    : params.style;
  const sortValue = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const type: GalleryTypeFilter = ["tattoo", "drawing"].includes(
    typeValue ?? "",
  )
    ? (typeValue as GalleryTypeFilter)
    : "all";
  const style: GalleryStyleFilter = galleryStyleOptions.some(
    (option) => option.value === styleValue,
  )
    ? (styleValue as GalleryStyleFilter)
    : "all";
  const sort: GallerySort = sortValue === "newest" ? "newest" : "featured";
  const parsedPage = Number.parseInt(pageValue ?? "1", 10);

  return {
    filters: { type, style, sort } satisfies GalleryFilters,
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

export function galleryPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const ordered = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
  const result: Array<number | "ellipsis"> = [];
  ordered.forEach((page, index) => {
    if (index && page - ordered[index - 1]! > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

export function galleryHref(filters: GalleryFilters, page = 1) {
  const params = new URLSearchParams();
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.style !== "all") params.set("style", filters.style);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

type FilterableGalleryItem = {
  type: PortfolioType;
  styleSlugs: readonly string[];
  featured: boolean;
  createdAt?: string;
  displayOrder: number;
};

export function galleryTypeGroup(type: PortfolioType) {
  return type === "tattoo" ? "tattoo" : "drawing";
}

export function filterAndSortGalleryItems<T extends FilterableGalleryItem>(
  items: readonly T[],
  filters: {
    type: GalleryTypeFilter;
    style: GalleryStyleFilter;
    sort: GallerySort;
  },
) {
  return items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .filter(({ item }) => {
      const matchesType =
        filters.type === "all" || galleryTypeGroup(item.type) === filters.type;
      const matchesStyle =
        filters.style === "all" || item.styleSlugs.includes(filters.style);
      return matchesType && matchesStyle;
    })
    .sort((left, right) => {
      if (filters.sort === "newest") {
        const leftTime = left.item.createdAt
          ? Date.parse(left.item.createdAt)
          : Number.NaN;
        const rightTime = right.item.createdAt
          ? Date.parse(right.item.createdAt)
          : Number.NaN;
        const leftHasDate = Number.isFinite(leftTime);
        const rightHasDate = Number.isFinite(rightTime);
        if (leftHasDate && rightHasDate && leftTime !== rightTime)
          return rightTime - leftTime;
        if (leftHasDate !== rightHasDate) return leftHasDate ? -1 : 1;
      }

      if (filters.sort === "featured") {
        const featuredDifference =
          Number(right.item.featured) - Number(left.item.featured);
        if (featuredDifference !== 0) return featuredDifference;
      }

      const orderDifference = left.item.displayOrder - right.item.displayOrder;
      return orderDifference || left.sourceIndex - right.sourceIndex;
    })
    .map(({ item }) => item);
}

export function paginateGalleryItems<T>(items: readonly T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / GALLERY_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (currentPage - 1) * GALLERY_PAGE_SIZE;

  return {
    currentPage,
    totalPages,
    items: items.slice(start, start + GALLERY_PAGE_SIZE),
  };
}
