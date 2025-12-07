import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, VerdictType, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkFact = async (claim: string): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Balanced model good for grounding

    // We cannot use JSON schema AND Search Grounding together easily due to API constraints.
    // So we will ask for a structured text response and parse it manually.
    const prompt = `
      You are a professional fact-checker. Your task is to verify the following claim using Google Search.
      
      CLAIM: "${claim}"

      Strictly follow this output format:
      Line 1: VERDICT: [REAL | FAKE | MISLEADING | SATIRE | UNVERIFIED]
      Line 2: CONFIDENCE: [Number between 0-100]
      Line 3: EXPLANATION_START
      [Provide a comprehensive, unbiased explanation in Markdown format. Cite specific details found in search.]
      
      Do not add any other introductory text.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for factual accuracy
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return parseResponse(text, groundingChunks);
  } catch (error) {
    console.error("Fact check failed:", error);
    throw error;
  }
};

const parseResponse = (text: string, groundingChunks?: GroundingChunk[]): AnalysisResult => {
  const lines = text.split('\n');
  let verdict = VerdictType.UNKNOWN;
  let confidenceScore = 0;
  let explanation = "";
  let explanationStarted = false;

  for (const line of lines) {
    if (line.startsWith("VERDICT:")) {
      const v = line.replace("VERDICT:", "").trim().toUpperCase();
      if (v.includes("REAL")) verdict = VerdictType.REAL;
      else if (v.includes("FAKE")) verdict = VerdictType.FAKE;
      else if (v.includes("MISLEADING")) verdict = VerdictType.MISLEADING;
      else if (v.includes("SATIRE")) verdict = VerdictType.SATIRE;
      else if (v.includes("UNVERIFIED")) verdict = VerdictType.UNVERIFIED;
    } else if (line.startsWith("CONFIDENCE:")) {
      const scoreStr = line.replace("CONFIDENCE:", "").trim();
      confidenceScore = parseInt(scoreStr, 10) || 0;
    } else if (line.trim() === "EXPLANATION_START") {
      explanationStarted = true;
    } else if (explanationStarted) {
      explanation += line + "\n";
    }
  }

  // Extract sources from grounding metadata
  const sources = groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web!.title,
      uri: chunk.web!.uri
    })) || [];

  // Deduplicate sources based on URI
  const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

  return {
    verdict,
    confidenceScore,
    explanation: explanation.trim(),
    sources: uniqueSources,
  };
};