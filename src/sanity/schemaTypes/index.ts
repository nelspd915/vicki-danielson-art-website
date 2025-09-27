import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import { homepage } from "./homepage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, homepage]
};
