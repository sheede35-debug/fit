import app from "./app";
import { logger } from "./lib/logger";
import { seedDatabase, isDatabaseEmpty } from "./lib/seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  // Auto-seed if DB is empty
  try {
    const empty = await isDatabaseEmpty();
    if (empty) {
      logger.info("Database is empty — seeding demo data…");
      await seedDatabase();
      logger.info("Demo data seeded successfully.");
    } else {
      logger.info("Database already has data — skipping auto-seed.");
    }
  } catch (err) {
    logger.warn({ err }, "Auto-seed failed (non-fatal — continuing startup)");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

start();
