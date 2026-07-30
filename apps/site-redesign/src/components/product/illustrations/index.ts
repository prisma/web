import { AgentErrors } from "./agent-errors";
import { AgentHosting } from "./agent-hosting";
import { BranchedStack } from "./branched-stack";
import { CoLocated } from "./co-located";
import { Compliance } from "./compliance";
import { ConfigBoth } from "./config-both";
import { ConfigJobs } from "./config-jobs";
import { DatabasePanel } from "./database-panel";
import { DenseSchema } from "./dense-schema";
import { Deployments } from "./deployments";
import { IsolatedBranches } from "./isolated-branches";
import { NoLockIn } from "./no-lock-in";
import { SchemaFile } from "./schema-file";
import { SpendLimits } from "./spend-limits";
import { TypedClient } from "./typed-client";

// Illustrations referenced by name from ProductPageContent, for the same reason
// icons are (see ../icons.ts): content objects stay serializable and CMS-ready.
// Extend as product pages need more abstractions.
export const PRODUCT_ILLUSTRATIONS = {
  agentErrors: AgentErrors,
  agentHosting: AgentHosting,
  branchedStack: BranchedStack,
  coLocated: CoLocated,
  compliance: Compliance,
  configBoth: ConfigBoth,
  configJobs: ConfigJobs,
  databasePanel: DatabasePanel,
  denseSchema: DenseSchema,
  deployments: Deployments,
  isolatedBranches: IsolatedBranches,
  noLockIn: NoLockIn,
  schemaFile: SchemaFile,
  spendLimits: SpendLimits,
  typedClient: TypedClient,
};

export type ProductIllustrationName = keyof typeof PRODUCT_ILLUSTRATIONS;
