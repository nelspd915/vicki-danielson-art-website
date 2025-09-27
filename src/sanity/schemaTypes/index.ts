import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import artist from "./artist";
import collection from "./collection";
import page from "./page";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, artist, collection, page]
};
