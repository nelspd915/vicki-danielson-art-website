import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import collection from "./collection";
import page from "./page";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, collection, page]
};
