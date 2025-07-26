import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from '@/contexts/settingApi';

interface AIResponse {
  content: string;
}

export async function getAICompletion(
  prompt: string,
  provider: AIProvider,
  model: string,
  apiKey: string
): Promise<AIResponse> {
  if (!apiKey) throw new Error(`${provider} API key not provided`);

  switch (provider) {
    case 'openai': {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const openaiResponse = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
      });
      return { content: openaiResponse.choices[0].message.content || '' };
    }

    case 'gemini': {
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: model });
      const geminiResult = await geminiModel.generateContent(prompt);
      const geminiResponse = await geminiResult.response;
      return { content: geminiResponse.text() };
    }

    case 'claude': {
      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const claudeResponse = await anthropic.messages.create({
        model: model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return { content: claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '' };
    }

    case 'custom': {
      // This case is for future expansion if a custom API endpoint is needed
      // For now, it will behave like Gemini, but can be extended.
      const genAI = new GoogleGenerativeAI(apiKey);
      const customModel = genAI.getGenerativeModel({ model: model });
      const customResult = await customModel.generateContent(prompt);
      const customResponse = await customResult.response;
      return { content: customResponse.text() };
    }

    default:
      throw new Error('Invalid AI provider selected');
  }
}
