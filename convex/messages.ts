import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
      isSeen: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
    });

    const members = await ctx.db
      .query("conversation_members")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    for (const m of members) {
      if (m.userId != args.senderId) {
        await ctx.db.patch(m._id, {
          unreadCount: m.unreadCount + 1,
        });
      }
    }
    return messageId;
  },
});

export const getMessagesByUsers = query({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("user1"), args.user1),
            q.eq(q.field("user2"), args.user2),
          ),
          q.and(
            q.eq(q.field("user1"), args.user2),
            q.eq(q.field("user2"), args.user1),
          ),
        ),
      )
      .first();

    if (!conversation) return [];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversation._id),
      )
      .order("asc")
      .collect();

    return messages;
  },
});
export const markMessagesAsSeenByUsers = mutation({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("user1"), args.user1),
            q.eq(q.field("user2"), args.user2),
          ),
          q.and(
            q.eq(q.field("user1"), args.user2),
            q.eq(q.field("user2"), args.user1),
          ),
        ),
      )
      .first();

    if (!conversation) return;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversation._id),
      )
      .filter((q) => q.eq(q.field("isSeen"), false))
      .collect();

    for (const msg of messages) {
      if (msg.senderId !== args.user1) {
        await ctx.db.patch(msg._id, {
          isSeen: true,
        });
      }
    }

    const membership = await ctx.db
      .query("conversation_members")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversation._id),
      )
      .filter((q) => q.eq(q.field("userId"), args.user1))
      .first();

    if (membership) {
      await ctx.db.patch(membership._id, {
        unreadCount: 0,
      });
    }
  },
});
