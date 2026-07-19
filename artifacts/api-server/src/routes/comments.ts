import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, commentsTable, usersTable } from "@workspace/db";
import {
  CreateCommentBody,
  CreateCommentParams,
  ListCommentsParams,
} from "@workspace/api-zod";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/requests/:requestId/comments", async (req, res): Promise<void> => {
  const params = ListCommentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const comments = await db.select().from(commentsTable).where(eq(commentsTable.requestId, params.data.requestId)).orderBy(commentsTable.createdAt);
  const result = await Promise.all(comments.map(async (c) => {
    const [author] = await db.select().from(usersTable).where(eq(usersTable.id, c.authorId));
    return {
      id: c.id,
      requestId: c.requestId,
      content: c.content,
      authorId: c.authorId,
      authorName: author?.name ?? "Unknown",
      authorAvatar: author?.avatar ?? null,
      createdAt: c.createdAt.toISOString(),
    };
  }));
  res.json(result);
});

router.post("/requests/:requestId/comments", async (req, res): Promise<void> => {
  const params = CreateCommentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [comment] = await db.insert(commentsTable).values({
    requestId: params.data.requestId,
    content: parsed.data.content,
    authorId: DEFAULT_USER_ID,
  }).returning();
  const [author] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  res.status(201).json({
    id: comment.id,
    requestId: comment.requestId,
    content: comment.content,
    authorId: comment.authorId,
    authorName: author?.name ?? "Unknown",
    authorAvatar: author?.avatar ?? null,
    createdAt: comment.createdAt.toISOString(),
  });
});

export default router;
