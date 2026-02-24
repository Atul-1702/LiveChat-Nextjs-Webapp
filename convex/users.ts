import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      return "User alrady exists.";
    }

    const userId = await ctx.db.insert("users", {
      ...args,
      isOnline: true,
      lastSeen: Date.now(),
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});

export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return "User not exists.";
    }
    let image;
    if (args.imageUrl) {
      image = await ctx.storage.getUrl(args.imageUrl);
    }
    const updatedUser = await ctx.db.patch(user._id, {
      name: args.name,
      imageUrl: image != null ? image : undefined,
    });
    return updatedUser;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const heartBeat = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isOnline: true,
      lastSeen: Date.now(),
    });
  },
});

export const setOffline = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isOnline: false,
      lastSeen: Date.now(),
    });
  },
});

export const setTyping = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      typingInConversation: args.conversationId,
    });
  },
});
export const clearTyping = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      typingInConversation: undefined,
    });
  },
});
