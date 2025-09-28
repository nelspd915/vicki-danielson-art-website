import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import { homepage } from "./homepage";
import location from "./location";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, homepage, location]
};
