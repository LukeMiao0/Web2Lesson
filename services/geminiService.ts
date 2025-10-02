// FIX: Add declaration for `process` to satisfy TypeScript in a browser environment.
// The `process.env.API_KEY` variable is injected at build time by Vite.
declare const process: {
  env: {
    API_KEY: string;
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { type LessonData, type QuizQuestion, type VocabularyItem } from '../types';

// Helper function to get the AI client, with the check inside.
const getAiClient = () => {
    // FIX: Use `process.env.API_KEY` to adhere to coding guidelines, resolving the original TypeScript error.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // FIX: Updated error message for clarity.
        throw new Error("Configuration error: API_KEY is not configured. Please set the VITE_API_KEY environment variable.");
    }
    return new GoogleGenAI({ apiKey: apiKey });
};

const vocabularySchema = {
    type: Type.ARRAY,
    description: "A list of 10 key vocabulary words from the text.",
    items: {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING, description: "The vocabulary word." },
        definition: { type: Type.STRING, description: "A simple, clear definition suitable for an ESL learner." },
        example: { type: Type.STRING, description: "An example sentence using the word in context." }
      },
      required: ["word", "definition", "example"]
    }
};

const quizSchema = {
    type: Type.ARRAY,
    description: "A list of 5 multiple-choice questions to test understanding of the text.",
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The quiz question." },
        options: {
          type: Type.ARRAY,
          description: "An array of 4 possible answers (strings).",
          items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.STRING, description: "The correct answer from the options list." }
      },
      required: ["question", "options", "correctAnswer"]
    }
};


const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the article text, written in Traditional Chinese."
    },
    vocabulary: vocabularySchema,
    comprehensionQuiz: quizSchema,
    discussionQuestions: {
      type: Type.ARRAY,
      description: "A list of 3 open-ended questions to encourage discussion.",
      items: { type: Type.STRING }
    }
  },
  required: ["summary", "vocabulary", "comprehensionQuiz", "discussionQuestions"]
};

export async function generateLessonFromText(articleText: string): Promise<LessonData> {
  const ai = getAiClient();
  const prompt = `You are an expert curriculum designer for college-level ESL students. Your task is to transform the following article text into a comprehensive and interactive learning module. The output must be a valid JSON object that adheres to the provided schema. Analyze the text for its main ideas, key vocabulary, and potential discussion points. Based on this analysis, generate a concise summary in Traditional Chinese, a list of 10 essential vocabulary words with clear definitions and example sentences, a 5-question multiple-choice comprehension quiz, and 3 thought-provoking discussion questions. Ensure the language used in definitions and questions is accessible to intermediate English learners. Here is the article text: """${articleText}"""`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: lessonSchema,
      temperature: 0.5,
    }
  });

  const jsonText = response.text.trim();
  const parsedData = JSON.parse(jsonText);
  
  return parsedData as LessonData;
}


export async function generateNewQuiz(articleText: string): Promise<QuizQuestion[]> {
    const ai = getAiClient();
    const prompt = `You are an expert curriculum designer for college-level ESL students. Based on the provided article text, generate a completely new set of 5 multiple-choice comprehension questions. These questions must be unique and different from any previously generated set for this text. The output must be a valid JSON object that adheres to the provided schema. Here is the article text: """${articleText}"""`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    comprehensionQuiz: quizSchema
                },
                required: ["comprehensionQuiz"]
            },
            temperature: 0.8, // Higher temperature for more creative/varied questions
        }
    });

    const jsonText = response.text.trim();
    // The response is nested under comprehensionQuiz key
    const parsedData = JSON.parse(jsonText);
    
    return parsedData.comprehensionQuiz as QuizQuestion[];
}

const singleWordSchema = {
    type: Type.OBJECT,
    properties: {
        definition: { type: Type.STRING, description: "A simple, clear definition suitable for an ESL learner." },
        example: { type: Type.STRING, description: "An example sentence using the word in the context of the provided article." }
    },
    required: ["definition", "example"]
};

export async function defineWord(word: string, context: string): Promise<Omit<VocabularyItem, 'word'>> {
    const ai = getAiClient();
    const prompt = `You are an expert curriculum designer for college-level ESL students. Given the word "${word}" and the context of the article below, please provide a simple definition and a relevant example sentence. The output must be a valid JSON object that adheres to the provided schema.

    Article Context: """${context}"""`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: singleWordSchema,
            temperature: 0.3,
        }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return parsedData as Omit<VocabularyItem, 'word'>;
}