import { Router } from "express";
import { seedDatabase } from "../lib/seed";

const router = Router();

/**
 * POST /admin/seed
 * Wipes all data and re-inserts the full demo dataset.
 *
 * Security controls (both must pass):
 *  1. NODE_ENV must not be "production" — the endpoint is removed from the
 *     routing table entirely when deployed to production.
 *  2. If DEMO_ADMIN_SECRET is set in the environment, the caller must supply
 *     that value in the X-Demo-Admin-Secret header.  This prevents casual
 *     CSRF-style calls from the browser in a shared dev environment.
 */
router.post("/admin/seed", async (req, res): Promise<void> => {
  // Guard 1: never allow in production
  if (process.env["NODE_ENV"] === "production") {
    res.status(403).json({ success: false, error: "This endpoint is disabled in production." });
    return;
  }

  // Guard 2: optional shared secret — checked when DEMO_ADMIN_SECRET is configured
  const requiredSecret = process.env["DEMO_ADMIN_SECRET"];
  if (requiredSecret) {
    const provided = req.headers["x-demo-admin-secret"];
    if (!provided || provided !== requiredSecret) {
      res.status(403).json({ success: false, error: "Missing or invalid X-Demo-Admin-Secret header." });
      return;
    }
  }

  try {
    await seedDatabase();
    res.json({ success: true, message: "Demo data reset successfully." });
  } catch (err: any) {
    console.error("Seed error:", err);
    res.status(500).json({ success: false, error: err?.message ?? "Unknown error during seed" });
  }
});

export default router;
