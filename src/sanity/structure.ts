import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Homepage Configuration - Featured at the top
      S.listItem()
        .title("🏠 Homepage Configuration")
        .child(S.documentTypeList("homepage").title("Homepage Settings").filter('_type == "homepage"')),

      S.divider(),

      // Art Management
      S.listItem()
        .title("🎨 Artworks")
        .child(S.documentTypeList("artwork").title("All Artworks").filter('_type == "artwork"')),

      S.divider(),

      // Other content types (if any)
      ...S.documentTypeListItems().filter((listItem) => !["homepage", "artwork"].includes(listItem.getId() || ""))
    ]);
