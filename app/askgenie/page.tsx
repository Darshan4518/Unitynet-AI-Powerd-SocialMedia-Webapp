"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { chatResponse } from "@/lib/actions/aiActions";

export default function AskGenie() {
  const [prompt, setPrompt] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handler to send a prompt to the AI
  const handleSend = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const newResponse = await chatResponse(prompt);
      setResponses((prevResponses) => [...prevResponses, newResponse]);
      setPrompt("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      {/* Responses Section */}
      <div className="flex-1 overflow-y-auto p-6 sm:max-h-[80vh] max-h-[70vh]">
        <div className="text-3xl sm:text-4xl font-extrabold text-center mb-6">
          How can I assist you today?
        </div>
        <div className="space-y-4">
          {responses.map((response, index) => (
            <div
              key={index}
              className="bg-gray-800 text-gray-300 p-4 rounded-xl shadow-lg"
            >
              {response}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-800 text-gray-300 p-4 rounded-xl shadow-lg">
              Generating response...
            </div>
          )}
          {error && (
            <div className="bg-red-800 text-gray-100 p-4 rounded-xl shadow-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 bg-black p-4 border-t border-gray-700">
        <div className="relative max-w-4xl mx-auto flex items-center gap-2">
          <Input
            className="flex-grow text-gray-300 bg-gray-800 border-gray-700 py-3 px-4 rounded-full shadow-md focus:ring focus:ring-blue-500"
            placeholder="Ask something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={loading}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSend}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-500 focus:ring focus:ring-blue-300"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="text-sm text-gray-500 mt-2 text-center">
        AskGenie can make mistakes. Please verify critical information.
      </div>
    </div>
  );
}
