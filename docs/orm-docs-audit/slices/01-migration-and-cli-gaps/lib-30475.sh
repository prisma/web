export PATH=/opt/homebrew/opt/postgresql@15/bin:$PATH
export PGHOST=localhost PGPORT=54331 PGUSER=postgres
W=/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/30475
BIN=$W/orm/packages/1-framework/3-tooling/cli/dist/bin.mjs
URL=postgresql://postgres@localhost:54331
prisma() { node $BIN "$@"; }
p() { echo "\$ prisma $*"; node $BIN "$@" --format human --no-color 2>&1 | sed -e 's/[[:space:]]*$//'; echo "[exit ${pipestatus[1]}]"; echo; }
fresh_db() { dropdb --if-exists $1 >/dev/null 2>&1; if [ -n "$2" ]; then createdb -T $2 $1; else createdb $1; fi; }
