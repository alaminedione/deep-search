import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { AIModel } from '@/contexts/settingApi';

interface AIResponse {
  content: string;
}

export async function getAICompletion(
  prompt: string,
  model: AIModel,
  keys: { openai?: string; gemini?: string; claude?: string }
): Promise<AIResponse> {
  switch (model) {
    case 'openai': {
      if (!keys.openai) throw new Error('OpenAI API key not provided');
      const openai = new OpenAI({ apiKey: keys.openai, dangerouslyAllowBrowser: true });
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });
      return { content: openaiResponse.choices[0].message.content || '' };
    }

    case 'gemini': {
      if (!keys.gemini) throw new Error('Gemini API key not provided');
      const genAI = new GoogleGenerativeAI(keys.gemini);
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const geminiResult = await geminiModel.generateContent(prompt);
      const geminiResponse = await geminiResult.response;
      return { content: geminiResponse.text() };
    }

    case 'claude': {
      if (!keys.claude) throw new Error('Claude API key not provided');
      const anthropic = new Anthropic({ apiKey: keys.claude, dangerouslyAllowBrowser: true });
      const claudeResponse = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return { content: claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '' };
    }

    default:
      throw new Error('Invalid AI model selected');
  }
}
