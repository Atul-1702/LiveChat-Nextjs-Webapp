import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateConversation = mutation({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
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

    if (existing) {
      return existing._id;
    }

    const id = await ctx.db.insert("conversations", {
      user1: args.user1,
      user2: args.user2,
      createdAt: Date.now(),
    });

    await ctx.db.insert("conversation_members", {
      conversationId: id,
      userId: args.user2,
      unreadCount: 0,
      createdAt: Date.now(),
    });

    await ctx.db.insert("conversation_members", {
      conversationId: id,
      userId: args.user1,
      unreadCount: 0,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const getUserConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const memberShips = await ctx.db
      .query("conversation_members")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const results = [];

    for (const m of memberShips) {
      const conv = await ctx.db.get(m.conversationId);
      if (!conv) {
        continue;
      }
      const otherUserId = args.userId === conv.user1 ? conv.user2 : conv.user1;

      const otherUser = await ctx.db.get(otherUserId);

      let lastMessage = null;

      let lastMessageTime = 0;

      if (conv.lastMessageId) {
        lastMessage = await ctx.db.get(conv.lastMessageId);
        lastMessageTime = lastMessage?.createdAt ?? 0;
      }

      results.push({
        conversationId: conv._id,
        otherUser,
        lastMessage,
        unreadCount: m.unreadCount,
        lastMessageTime,
      });
    }

    results.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    return results;
  },
});
