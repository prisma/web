import "./composer/env.ts";
import { defineConfig as composer } from "@prisma/composer/config";
import { prismaCloud, prismaState } from "@prisma/composer-prisma-cloud/control";
import { definePrismaConfig } from "prisma/config";
import { gatewayBuild, websiteBuild } from "./composer/website-build.ts";
import { fileURLToPath } from "node:url";

// Each checkout owns its local compute daemon, which inherits the repo's
// pinned Bun. Existing machine-wide emulators may use an older global Bun.
process.env.PRISMA_COMPOSER_EMULATORS_DIR ??= fileURLToPath(
  new URL("./.prisma-composer/emulators/", import.meta.url),
);

export default definePrismaConfig({
  composer: composer({
    extensions: [prismaCloud(), gatewayBuild(), websiteBuild()],
    state: prismaState(),
  }),
});
