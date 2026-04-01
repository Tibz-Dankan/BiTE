package pkg

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"google.golang.org/genai"
)

// GenerateAIPreviewSummary sends the question and answer data to the Gemini AI model
// and returns the AI-generated summary along with the prompt used.
func GenerateAIPreviewSummary(questionTitle string, questionIntroduction string, answers []map[string]interface{}) (string, string, error) {
	apiKey := os.Getenv("BiTE_GEMNI_API_KEY")
	if apiKey == "" {
		return "", "", fmt.Errorf("BiTE_GEMNI_API_KEY is not set")
	}

	// Build the question and answers string
	var answersStr strings.Builder
	for i, answer := range answers {
		isCorrect := ""
		if correct, ok := answer["isCorrect"].(bool); ok && correct {
			isCorrect = " [CORRECT ANSWER]"
		}
		title := ""
		if t, ok := answer["title"].(string); ok {
			title = t
		}
		answersStr.WriteString(fmt.Sprintf("  Answer %d: %s%s\n", i+1, title, isCorrect))
	}

	prompt := fmt.Sprintf(`You are an expert educational content analyzer. Analyze the following quiz question and its answers, then provide a precise but detailed explanation of the correct answer.

Question: %s
%s
Answers:
%s
Instructions:
1. Identify the correct answer(s) from the list above (marked with [CORRECT ANSWER]).
2. Explain WHY the correct answer is right with clear reasoning.
3. Briefly explain why the other answers are incorrect.
4. Provide any additional educational context that helps the learner understand the concept better.
5. Keep the explanation concise but comprehensive enough for a student to fully understand.
6. Format your response as a clear, readable summary without using markdown headers.

Provide your analysis:`, questionTitle, func() string {
		if questionIntroduction != "" {
			return fmt.Sprintf("Context/Introduction: %s", questionIntroduction)
		}
		return ""
	}(), answersStr.String())

	log.Printf("Sending AI Preview prompt for question: %s", questionTitle)

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return "", prompt, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	result, err := client.Models.GenerateContent(
		ctx,
		// "gemini-3.1-pro-preview",
		"gemini-3.1-flash-lite-preview",
		genai.Text(prompt),
		nil,
	)
	if err != nil {
		return "", prompt, fmt.Errorf("failed to generate content from Gemini: %w", err)
	}

	summary := result.Text()
	log.Printf("Received AI Preview summary for question: %s (length: %d chars)", questionTitle, len(summary))

	return summary, prompt, nil
}
