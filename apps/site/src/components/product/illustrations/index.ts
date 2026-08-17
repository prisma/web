import { AgentErrors } from "./agent-errors";
import { AgentHosting } from "./agent-hosting";
import { AnyDatabase } from "./any-database";
import { BranchedStack } from "./branched-stack";
import { ClientAutocomplete } from "./client-autocomplete";
import { CoLocated } from "./co-located";
import { Compliance } from "./compliance";
import { ConfigBoth } from "./config-both";
import { ConfigJobs } from "./config-jobs";
import { DatabasePanel } from "./database-panel";
import { DenseSchema } from "./dense-schema";
import { DeployLog } from "./deploy-log";
import { Deployments } from "./deployments";
import { IsolatedBranches } from "./isolated-branches";
import { MigrationBlocked } from "./migration-blocked";
import { NoLockIn } from "./no-lock-in";
import { ObjectStore } from "./object-store";
import { QueryInsights } from "./query-insights";
import { RepoConnect } from "./repo-connect";
import { RunTemplates } from "./run-templates";
import { SchemaFile } from "./schema-file";
import { SpendLimits } from "./spend-limits";
import { StudioTable } from "./studio-table";
import { TypedClient } from "./typed-client";

// Illustrations referenced by name from ProductPageContent, for the same reason
// icons are (see ../icons.ts): content objects stay serializable and CMS-ready.
// Extend as product pages need more abstractions.
//
// Two scales live here. Feature-card abstractions sit in a SurfaceCard and are
// read at ~260px tall; the hero-tour panels (see ../product-tour.tsx) sit in a
// HeroPanel and fill ~600x450, so they carry far more real detail. Both are in
// this one map because content addresses them the same way.
export const PRODUCT_ILLUSTRATIONS = {
  agentErrors: AgentErrors,
  agentHosting: AgentHosting,
  anyDatabase: AnyDatabase,
  branchedStack: BranchedStack,
  clientAutocomplete: ClientAutocomplete,
  coLocated: CoLocated,
  compliance: Compliance,
  configBoth: ConfigBoth,
  configJobs: ConfigJobs,
  databasePanel: DatabasePanel,
  denseSchema: DenseSchema,
  deployLog: DeployLog,
  deployments: Deployments,
  isolatedBranches: IsolatedBranches,
  migrationBlocked: MigrationBlocked,
  noLockIn: NoLockIn,
  objectStore: ObjectStore,
  queryInsights: QueryInsights,
  repoConnect: RepoConnect,
  runTemplates: RunTemplates,
  schemaFile: SchemaFile,
  spendLimits: SpendLimits,
  studioTable: StudioTable,
  typedClient: TypedClient,
};

export type ProductIllustrationName = keyof typeof PRODUCT_ILLUSTRATIONS;
