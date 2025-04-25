import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { getUserById, createConversation, createMessage, getMessagesByConversationId } from '@/app/utils/db';
import { generateChatResponse, ChatMessage } from '@/app/utils/openai';

export async function POST(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the request body
    const { message, conversationId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // Cast userId to number from the payload
    const userId = Number(payload.userId);
    
    // Verify user exists
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create or use existing conversation
    let actualConversationId = conversationId;
    if (!actualConversationId) {
      const newConversation = await createConversation(userId);
      actualConversationId = newConversation.id;
    }

    // Save user message to the database
    await createMessage(actualConversationId, 'user', message);

    // Get conversation history
    const conversationHistory = await getMessagesByConversationId(actualConversationId);
    
    // Format messages for OpenAI
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: 'You are Gepetinho, a helpful AI assistant.' },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Generate AI response
    const aiResponse = await generateChatResponse(chatMessages);
    
    // Save AI response to the database
    await createMessage(actualConversationId, 'assistant', aiResponse);

    // Return the AI response
    return NextResponse.json({
      message: aiResponse,
      conversationId: actualConversationId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 