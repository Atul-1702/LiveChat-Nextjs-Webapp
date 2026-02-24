import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
    createdAt: v.number(),
    typingInConversation: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),
  conversations: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    lastMessageId: v.optional(v.id("messages")),
    createdAt: v.number(),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"]),
  conversation_members: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    unreadCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.optional(v.string()),
    isSeen: v.boolean(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),
});
