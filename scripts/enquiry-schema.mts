/**
 * APPLY THE ENQUIRY SCHEMA — src/lib/enquiry/schema.sql, against DATABASE_URL.
 *
 *   node scripts/enquiry-schema.mts
 *
 * Every statement in the file is idempotent (CREATE … IF NOT EXISTS), so this
 * is safe to run again after a table is added — which is how
 * enquiry_attachments arrived. There is no psql on the build machines; this
 * uses the same Neon driver the site does.
 */

import { readFileSync } from "node:fs";
import { Resolver } from "node:dns/promises";
import { Agent, fetch as undiciFetch } from "undici";
import { neon, neonConfig } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set — source .env.local first");

// Some office and mobile networks' resolvers refuse *.neon.tech. When
// DNS_SERVERS is set (e.g. "1.1.1.1"), look the host up there instead of
// through the system resolver — only for this script's connection.
if (process.env.DNS_SERVERS) {
  const resolver = new Resolver();
  resolver.setServers(process.env.DNS_SERVERS.split(","));
  const agent = new Agent({
    connect: {
      lookup: (hostname, _opts, cb) => {
        resolver
          .resolve4(hostname)
          .then((addrs) => cb(null, addrs.map((address) => ({ address, family: 4 }))))
          .catch((err) => cb(err, []));
      },
    },
  });
  neonConfig.fetchFunction = (input: string | URL | Request, init?: RequestInit) =>
    undiciFetch(input as string, { ...(init as object), dispatcher: agent } as Parameters<typeof undiciFetch>[1]);
}

const sql = neon(url);
const file = readFileSync("src/lib/enquiry/schema.sql", "utf8");
// Statements end at a semicolon at end of line; comments are stripped first.
const statements = file
  .replace(/^--.*$/gm, "")
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  const head = statement.split("\n")[0].replace(/\s+/g, " ").slice(0, 72);
  await sql.query(statement);
  console.log(`  ✓ ${head}`);
}

const tables = (await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN ('enquiries', 'enquiry_attachments')
  ORDER BY table_name
`) as { table_name: string }[];
console.log(`\n${tables.map((t) => t.table_name).join(", ")} present.`);
