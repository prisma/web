---
title: "Rebuilding Prisma Postgres Backups: From Snapshots to Point-in-Time Recovery"
slug: "prisma-postgres-pgbackrest"
date: "2026-07-14"
authors:
  - "Tyler Benfield"
metaTitle: "Rebuilding Prisma Postgres Backups: From Snapshots to Point-in-Time Recovery"
metaDescription: "We replaced the Prisma Postgres backup system end to end: pg_basebackup to pgBackRest, and a new storage backbone on Tigris. Join us for a deep dive into the architecture, why we chose Tigris, and how it unlocks point-in-time recovery and database forks that carry their full backup history."
metaImagePath: "/prisma-postgres-pgbackrest/imgs/meta.png"
heroImagePath: "/prisma-postgres-pgbackrest/imgs/hero.svg"
heroImageAlt: "A diagram showing a Prisma Postgres database archiving WAL continuously to its own Tigris bucket, with a new database forking off from a point in its history."
excerpt: "We replaced the Prisma Postgres backup system end to end: pg_basebackup to pgBackRest, and a new storage backbone on Tigris. The result is faster recovery, simpler mechanics, and database forks that inherit their full backup history for free."
tags:
  - "platform"
  - "postgres"
---

[Prisma Postgres](https://www.prisma.io/postgres) runs every database as its own lightweight VM on our fleet of bare metal servers. That gives us strong isolation, and VMs can restore from memory snapshots in milliseconds. But it also means everything we build has to work at fleet scale, running across hundreds of thousands of databases every day. Backups are a good example.

We recently replaced our backup system end to end. We swapped the backup tool from [pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html) to [pgBackRest](https://pgbackrest.org/). We also changed the storage layer to a new object storage layout on [Tigris](https://www.tigrisdata.com/), where every database gets a dedicated, isolated bucket. This post dives into how the new system works, why we built the storage layer this way, and what it unlocks.

TL;DR

- Recovery point measured in seconds instead of hours
- Restores boot straight into a running database. We cut an entire VM lifecycle out of the critical path
- Point-in-time recovery to any timestamp, not just the last snapshot
- Forks that carry their full backup history, without duplicating that history

## How backups worked before

The old system used pg_basebackup, the standard backup tool that ships with Postgres, and it has served us well for a long time. It's worth walking through how it worked so the rest of this makes sense.

pg_basebackup takes a full physical copy of the database every time it runs, and there's no real incremental mode, so backup volume scales with total data size rather than how much data actually changed. A database that writes 10 MB a day but holds 100 GB still pays the full 100 GB price on every backup.

Each backup ran on its own short-lived VM, provisioned right next to the database. At our scale, that meant running a second fleet, with backup VMs provisioned, monitored, sized, and torn down thousands of times a day. Those VMs utilized the same bare metal hosts, impacting our capacity planning. Our backup orchestrator needed to be aware of the capacity of each host to safely manage resource utilization.

Backups ran twice a day per database, so the recovery point was up to 12 hours, and restore only worked against the available snapshots.

Restore itself took two VMs. First, a recovery VM downloaded the backup archive and unpacked it onto a fresh volume. Then we destroyed that VM and provisioned a second one, the real database VM, on top of the restored volume. Two full VM lifecycles for every recovery, with a volume handoff in the middle.

None of this was broken. It was just the natural result of building around full-copy snapshot backups. The recovery point, the second fleet, the capacity contention, the two-step restore: all of it traced back to the decision to build on pg_basebackup. So we changed the decision.

## What pgBackRest changes

pgBackRest is an open source backup and restore tool built for Postgres. It supports full, differential, and incremental backups, archives WAL continuously, and speaks the S3 protocol natively. Switching to it changed four things at once.

### From hours to seconds

Postgres writes every change to its write-ahead log, or WAL, before it applies that change. With pgBackRest, the running database archives its WAL segments to object storage continuously, as they fill up. No backup VM has to spin up for data to be protected. Protection is just a property of the database running.

The recovery point drops from up to twelve hours to about one WAL segment. In practice that's seconds to a few minutes of exposure, depending on how much the database is writing, instead of half a day.

We still take base backups, since WAL replay needs a starting point, but now a scheduler on the host triggers them against the running instance. Every database VM already runs a Postgres extension that handles a handful of operational concerns, like metrics reporting and scale-to-zero, and the pgBackRest binary was already embedded in the VM image for WAL archiving. So we added a few SQL functions to that extension to trigger backups, using regular SQL as our orchestration protocol. The extension exposes functions our orchestrator calls to start a full, differential, or incremental backup, and to check backup status. The result is that pgBackRest runs right inside the database VM, triggered over SQL, while a central service coordinates the whole fleet. No extra VM, no sidecar API, no added complexity.

### Point-in-time recovery

A base backup plus a continuous WAL stream gives us a complete history over our configured retention period. We can restore a database to any timestamp by replaying WAL from the nearest base backup up to that exact moment, or restore to a named backup if that's what you want instead.

The new system supports three restore modes:

1. In-place disaster recovery: restore the database to its latest state
2. Fork at a backup: create a new database from a specific base backup
3. Fork at a timestamp: create a new database at any point in time, real PITR

We'll soon expose the ability to restore to just before a bad migration or an accidental deletion.

### Restore is a single VM now

The old restore path provisioned a recovery VM, restored onto a volume, destroyed that VM, then provisioned the real database VM. The new path is simpler: the restore VM is the database.

The VM boots, the launcher runs `pgbackrest restore` to replay the backup into place, and then it execs into Postgres. One VM lifecycle instead of two. We cut an entire VM provision and volume handoff out of the critical path of every recovery, right when speed matters most.

### Less to run

The per-backup VM fleet is gone. The capacity contention between backups and other workloads is gone. The signed-URL and backup-token system we built to ship archives between VMs is gone too.

Incremental backups mean storage and transfer now track how much data changed, not how much data exists. The 100 GB database that writes 10 MB a day finally pays a price closer to 10 MB.

## One bucket per database

The storage design comes down to one rule: a database's entire backup identity is one bucket, named from its database ID.

That one rule does a lot of work.

The control plane doesn't need to track any of this: there's no bucket registry and no stored per-database credentials. Given a database ID, we can always derive the bucket name and mint fresh credentials on demand. If we ever had to rebuild the control plane from scratch, the backup layer wouldn't need any of that state recovered, which makes disaster recovery of the control plane itself simpler, not just recovery of individual databases.

Isolation is built into the shape of the system. The common alternative is a shared bucket with a prefix per tenant, where isolation depends on every piece of code applying the right prefix filter, every time, forever. We don't have that. For us, a credential is scoped to one bucket, and one bucket belongs to one database. If a credential ever leaks or gets misused, the damage is limited to that one database's backups.

## Why Tigris

This is where [Tigris](https://www.tigrisdata.com/) became a differentiating choice for us. Tigris is an S3-compatible blob storage backend that supports creating unlimited buckets programmatically.

### Cheap, unlimited buckets

One bucket per database only works if you can create tens of thousands of buckets without asking anyone's permission. Most object stores treat buckets as a scarce, account-level resource with hard caps. Getting one bucket per tenant elsewhere usually means quota requests and a mess of custom IAM automation to work around the limits. Tigris makes creating buckets cheap, fast, and effectively unlimited. The storage design we wanted on paper is the one Tigris actually let us build.

### Credentials scoped to one bucket

Every time a VM boots, we mint a fresh access key scoped to that one bucket. The org-level credential never leaves the control plane. With Tigris, this is a simple API call facilitated by their SDK.

### Forking a bucket

This is the one that unlocked a real product feature. Tigris can fork a bucket from a point-in-time snapshot, and the fork shares the same underlying data as the original. Forking a 500 GB backup repository takes the same time as forking a 500 MB one, and it costs nothing until the two copies start to diverge.

Forking a Prisma Postgres database means forking the bucket, booting a new VM, and running pgBackRest restore from that forked bucket onto the new VM's volume. That restore step still moves real data onto a real volume, so it isn't instant, and its cost still scales with the size of the database. This is necessary because all Prisma Postgres databases operate from NVMe disks directly attached to our bare-metal machines. We don't use network storage for database data.

What the bucket fork buys us is history. The new database gets its own full, independent backup history, every base backup and every WAL segment of the original, without copying any of it at fork time, and it can restore from any point in that history. Without bucket forking, giving a fork its own complete history would mean copying the entire backup repository up front. It also simplified our permission structure for restores since the new VM only needs credentials for the forked bucket, not the original.

### S3-compatible

pgBackRest talks to S3 out of the box. Pointing a database at its backup repository takes four environment variables: endpoint, bucket, key, and secret. No custom storage driver, no sidecar process, no extra code baked into the database image.

## What this unlocks for users

The infrastructure story is fun for us to build, but the reason we did any of this is what it makes possible in the product.

Disaster recovery from a hardware failure loses a lot less data now. WAL archiving to Tigris ensures we lose at most one WAL segment per database if a disaster occurs. Full, differential, and incremental backups also enable faster restoration, since pgBackRest only has to replay the fewest files needed to reach the desired recovery state.

Forks get more useful. A fork can start from right now, or from a point in the database's history, and it comes with that entire history already attached, so there's no separate backup chain to bootstrap first. That's useful for staging environments, preview databases for pull requests, testing against a copy of production data, or recovering from a bad SQL script.

## Wrapping up

We replaced full-copy backups on throwaway VMs with continuous WAL archiving straight from the database, stored in a bucket that belongs to just that database, restored by booting straight into the final VM. Every problem we didn't like about the old system traced back to the decision to use pg_basebackup and was addressed by building around pgBackRest. Changing that one decision fixed the recovery point, the restore path, and the infrastructure footprint, all at once.

Next up: point-in-time forking in the Prisma Console, the Management API, the MCP server, and the Prisma CLI. Soon your agent will be able to fork production at a specific timestamp just as easily as you can.

If you haven't tried [Prisma Postgres](https://www.prisma.io/postgres) yet, it takes about a minute to spin up a database. The docs cover [backups and restore](https://www.prisma.io/docs/postgres/database/backups) today, and we'll announce PITR when it ships. Stay tuned, or [sign up to get alerted](https://www.prisma.io/newsletter).
