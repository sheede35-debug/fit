import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

// Get or create a local user record based on Clerk userId
// In a multi-tenant app, we use the first company as default for demo purposes
export const getLocalUser = async (req: Request): Promise<typeof usersTable.$inferSelect | null> => {
  const auth = getAuth(req);
  if (!auth?.userId) return null;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, auth.userId)).limit(1);
  return user ?? null;
};

// Middleware that attaches localUser to request
export const attachLocalUser = async (req: Request & { localUser?: typeof usersTable.$inferSelect }, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    next();
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, auth.userId)).limit(1);
  if (user) {
    (req as any).localUser = user;
  }
  next();
};
