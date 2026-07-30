import { AgentErrors } from "./agent-errors";
import { DenseSchema } from "./dense-schema";
import { SchemaFile } from "./schema-file";
import { TypedClient } from "./typed-client";

// Illustrations referenced by name from ProductPageContent, for the same reason
// icons are (see ../icons.ts): content objects stay serializable and CMS-ready.
// Extend as product pages need more abstractions.
export const PRODUCT_ILLUSTRATIONS = {
  agentErrors: AgentErrors,
  denseSchema: DenseSchema,
  schemaFile: SchemaFile,
  typedClient: TypedClient,
};

export type ProductIllustrationName = keyof typeof PRODUCT_ILLUSTRATIONS;
