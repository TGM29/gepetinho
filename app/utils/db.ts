// This file is a placeholder for the Cloudflare D1 database interface
// In a production environment, this would connect to the actual D1 database

export interface User {
  id: number;
  email: string;
  password: string;
  username?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Mock database for development purposes
// In production, this would be replaced with actual D1 database connections
const mockDB = {
  users: [] as User[],
  conversations: [] as Conversation[],
  messages: [] as Message[],
};

// User operations
export const createUser = async (email: string, password: string, username?: string) => {
  const id = mockDB.users.length + 1;
  const now = new Date().toISOString();
  
  const newUser = {
    id,
    email,
    password,
    username,
    created_at: now,
  };
  
  mockDB.users.push(newUser);
  return newUser;
};

export const getUserByEmail = async (email: string) => {
  return mockDB.users.find(user => user.email === email) || null;
};

export const getUserById = async (id: number) => {
  return mockDB.users.find(user => user.id === id) || null;
};

// Conversation operations
export const createConversation = async (userId: number, title: string = 'New Conversation') => {
  const id = mockDB.conversations.length + 1;
  const now = new Date().toISOString();
  
  const newConversation = {
    id,
    user_id: userId,
    title,
    created_at: now,
    updated_at: now,
  };
  
  mockDB.conversations.push(newConversation);
  return newConversation;
};

export const getConversationsByUserId = async (userId: number) => {
  return mockDB.conversations.filter(conversation => conversation.user_id === userId);
};

export const getConversationById = async (id: number) => {
  return mockDB.conversations.find(conversation => conversation.id === id) || null;
};

// Message operations
export const createMessage = async (conversationId: number, role: 'user' | 'assistant', content: string) => {
  const id = mockDB.messages.length + 1;
  const now = new Date().toISOString();
  
  const newMessage = {
    id,
    conversation_id: conversationId,
    role,
    content,
    created_at: now,
  };
  
  mockDB.messages.push(newMessage);
  return newMessage;
};

export const getMessagesByConversationId = async (conversationId: number) => {
  return mockDB.messages.filter(message => message.conversation_id === conversationId);
}; 