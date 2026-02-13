import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./db_connection.js";

async function migrateData() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  process.exit(0);
}

migrateData().catch((err) => {
  console.error(err);
  process.exit(1);
});
