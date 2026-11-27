#!/bin/zsh
source "$(dirname "$0")/lib-30475.sh"
cd $W/scratch
H1=91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
H2=a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
D1=20260930T0540_baseline
D2=20260930T0540_add_user_phone
NODB=(--config prisma.nodb.config.ts)
typeset -a FORMS
FORMS=(
 "full-hash|$H1"
 "dir-name|$D1"
 "dir^|$D2^"
 "@empty|@empty"
 "@contract|@contract"
 "@db|@db"
 "path-migration-dir|./migrations/app/$D1"
 "path-contract-json|./src/prisma/contract.json"
 "path-snapshot-json|./migrations/snapshots/$H1/contract.json"
)
reset_mig() { rm -rf migrations; cp -R ../migrations.pristine migrations; }
SUM=$W/matrix-summary.tsv
LOG=$W/matrix.log
: > $SUM; : > $LOG
run() { # label form-label -- args
  local label=$1 fl=$2; shift 2
  reset_mig
  echo "### $label | $fl" >> $LOG
  echo "\$ prisma $*" >> $LOG
  local out; out=$(node $BIN "$@" --format human --no-color 2>&1; echo "EXIT=$?")
  echo "$out" >> $LOG; echo >> $LOG
  local ec=$(echo "$out" | sed -n 's/^EXIT=//p')
  local code=$(echo "$out" | grep -oE '\[[A-Z_]+\.[A-Z_0-9]+\]' | head -1)
  local last=$(echo "$out" | grep -E '^(✘|✔|⚠|ℹ)' | tail -1 | cut -c1-160)
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$label" "$fl" "$ec" "$code" "$last" "prisma $*" >> $SUM
}
fresh_db r30475 tmpl_h1
for f in $FORMS; do
  fl=${f%%|*}; v=${f#*|}
  run "migration status --to" $fl migration status --to "$v"
  run "migration status --from" $fl migration status --from "$v"
  run "migration status --from (no db configured)" $fl migration status --from "$v" $NODB
  run "migration status --from <H1> --to (no db configured)" $fl migration status --from $H1 --to "$v" $NODB
  fresh_db t_e tmpl_empty
  run "db migrate --to (empty db)" $fl db migrate --to "$v" --db $URL/t_e
  fresh_db t_h1 tmpl_h1
  run "db migrate --to (db at H1)" $fl db migrate --to "$v" --db $URL/t_h1
  fresh_db t_h2 tmpl_h2
  run "db migrate --to (db at H2)" $fl db migrate --to "$v" --db $URL/t_h2
  run "db migrate --to (no db configured)" $fl db migrate --to "$v" $NODB
  run "db migrate --show --to (db at H1)" $fl db migrate --show --to "$v"
  fresh_db t_e tmpl_empty
  run "db migrate --show --to (empty db)" $fl db migrate --show --to "$v" --db $URL/t_e
  run "db migrate --show --to (no db configured)" $fl db migrate --show --to "$v" $NODB
  run "db migrate --show --from (db at H1)" $fl db migrate --show --from "$v"
  run "db update --dry-run --to (db at H1)" $fl db update --dry-run --to "$v"
  fresh_db t_h2 tmpl_h2
  run "db update --to (db at H2)" $fl db update --to "$v" --db $URL/t_h2 --yes --confirm t_h2
  fresh_db t_h1 tmpl_h1
  run "db sign [contract] (db at H1)" $fl db sign "$v" --db $URL/t_h1
  fresh_db t_h1 tmpl_h1
  run "db sign --contract (db at H1)" $fl db sign --contract "$v" --db $URL/t_h1
  run "migration plan --from" $fl migration plan --from "$v" --name t
done
reset_mig
