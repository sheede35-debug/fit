import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import {
  ListNotificationsQueryParams,
  MarkNotificationReadParams,
} from "@workspace/api-zod";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/notifications", async (req, res): Promise<void> => {
  const params = ListNotificationsQueryParams.safeParse(req.query);
  const notifications = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, DEFAULT_USER_ID))
    .orderBy(notificationsTable.createdAt);

  const filtered = notifications.filter(n => {
    if (params.success && params.data.unread === true && n.isRead) return false;
    return true;
  });

  res.json(filtered.map(n => ({
    ...n,
    requestTitle: n.requestTitle ?? null,
    requestId: n.requestId ?? null,
    createdAt: n.createdAt.toISOString(),
  })));
});

router.patch("/notifications/:notificationId/read", async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [notification] = await db.update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.id, params.data.notificationId))
    .returning();
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json({ ...notification, requestTitle: notification.requestTitle ?? null, requestId: notification.requestId ?? null, createdAt: notification.createdAt.toISOString() });
});

router.post("/notifications/read-all", async (req, res): Promise<void> => {
  await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, DEFAULT_USER_ID));
  res.json({ success: true });
});

export default router;
