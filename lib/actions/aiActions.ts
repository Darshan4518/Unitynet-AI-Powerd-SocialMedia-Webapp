"use server";

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({
<<<<<<< HEAD
  model: "gemini-pro",
=======
<<<<<<< HEAD
  model: "gemini-pro",
=======
<<<<<<< HEAD
  model: "gemini-pro",
=======
  model: "gemini-2.0-flash",
>>>>>>> story-part
>>>>>>> e146371 (Initial commit)
>>>>>>> 1c83196 (some issue fixed)
});

export async function generateCaption(prompt: string): Promise<string> {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const promptGen = `You are a creative assistant specializing in crafting engaging social media captions. Generate a catchy caption for a social media post about: ${prompt}. The caption should be short, engaging, and suitable for platforms like Instagram or Twitter.`;

    const result = await model.generateContent(promptGen);
    const response = await result.response;
    const output = response.text().trim();

    if (!output) {
      throw new Error("Generated caption is empty");
    }

    return output;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate caption: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while generating the caption");
    }
  }
}

export async function chatResponse(userPrompt: string): Promise<string> {
  try {
    if (!userPrompt) {
      throw new Error("User prompt is required");
    }

    const promptGen = `You are a highly intelligent and conversational assistant. Respond to the following prompt in an engaging and helpful manner: ${userPrompt}`;

    const result = await model.generateContent(promptGen);
    const response = await result.response;
    const output = response.text().trim();

    if (!output) {
      throw new Error("Generated response is empty");
    }

    return output;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate chat response: ${error.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while generating the chat response"
      );
    }
  }
}

export async function generateBio(description: string): Promise<string> {
  try {
    if (!description) {
      throw new Error("Description is required");
    }

    const promptGen = `You are a professional bio writer. Craft an engaging, professional, and concise bio for an individual based on the following description: ${description}. Ensure the bio is suitable for platforms like LinkedIn, personal websites, or professional portfolios.`;

    const result = await model.generateContent(promptGen);
    const response = await result.response;
    const output = response.text().trim();

    if (!output) {
      throw new Error("Generated bio is empty");
    }

    return output;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate bio: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while generating the bio");
    }
  }
}
