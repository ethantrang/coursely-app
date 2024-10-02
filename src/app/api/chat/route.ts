import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: NextRequest) {
  const { message, chatHistory } = await req.json();

  try {

    // Initialize language model
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      streaming: true,
    });

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant for Rezilium, a strategic leadership development firm. Provide an encouraging response acknowledging the user's message under 50 words. Personalize your response to user with techniques like mirroring. Do not ask for additional information/questions. Respond in all lowercase."],
      ["human", "{input}"],
    ]);

    // Create chain
    const chain = prompt.pipe(llm);
    const input = message;

    // Generate response
    const stream = await chain.stream({ input });

    // Return streaming response
    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(chunk.content);
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain',
          'Transfer-Encoding': 'chunked',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
