package aipreview

import (
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
)

func BackfillAIPreviews() {
	log.Println("=== Starting AI Preview backfill ===")

	quizModel := models.Quiz{}

	// Fetch all attemptable quizzes
	log.Println("Fetching all attemptable quizzes...")
	quizzes, err := quizModel.FindAllAttemptable(500, "", "")
	if err != nil {
		log.Printf("Error fetching attemptable quizzes: %v", err)
		return
	}
	log.Printf("Found %d attemptable quizzes", len(quizzes))

	totalProcessed := 0
	totalCreated := 0
	totalSkipped := 0
	totalErrors := 0

	for quizIndex, quiz := range quizzes {
		log.Printf("--- Processing quiz %d/%d: ID=%s, Title=%s ---", quizIndex+1, len(quizzes), quiz.ID, quiz.Title)

		// Fetch all questions for this quiz with their answers
		questionModel := models.Question{}
		questions, err := questionModel.FindAllByQuiz(quiz.ID, 500, "")
		if err != nil {
			log.Printf("Error fetching questions for quiz %s: %v", quiz.ID, err)
			totalErrors++
			continue
		}
		log.Printf("Found %d questions for quiz %s", len(questions), quiz.ID)

		for questionIndex, question := range questions {
			totalProcessed++
			log.Printf("  Processing question %d/%d: ID=%s, Title=%s", questionIndex+1, len(questions), question.ID, question.Title)

			// Check if an AI preview already exists for this question
			aiPreviewModel := models.AIPreview{}
			existingPreviews, err := aiPreviewModel.FindByQuestionID(question.ID)
			if err != nil {
				log.Printf("  Error checking existing AI previews for question %s: %v", question.ID, err)
				totalErrors++
				continue
			}

			if len(existingPreviews) > 0 {
				log.Printf("  Skipping question %s - already has %d AI preview(s)", question.ID, len(existingPreviews))
				totalSkipped++
				continue
			}

			// Build answers data for the AI prompt
			var answers []map[string]interface{}
			for _, answer := range question.Answers {
				answers = append(answers, map[string]interface{}{
					"title":     answer.Title,
					"isCorrect": answer.IsCorrect,
				})
			}
			log.Printf("  Built %d answers for AI prompt", len(answers))

			// Generate AI summary
			log.Printf("  Sending prompt to Gemini AI for question %s...", question.ID)
			summary, prompt, err := pkg.GenerateAIPreviewSummary(question.Title, question.Introduction, answers)
			if err != nil {
				log.Printf("  ERROR generating AI preview for question %s: %v", question.ID, err)
				totalErrors++

				// Wait before retrying the next request even on error
				log.Printf("  Waiting 5 seconds before next request...")
				time.Sleep(5 * time.Second)
				continue
			}
			log.Printf("  Recegemini-3.1-flash-lite-previewived AI summary for question %s (length: %d chars)", question.ID, len(summary))

			// Save the AI preview to the database
			newAIPreview := models.AIPreview{
				QuestionID: question.ID,
				Summary:    summary,
				Prompt:     prompt,
				IsDefault:  true, // First preview for each question is the default
			}

			createdAIPreview, err := aiPreviewModel.Create(newAIPreview)
			if err != nil {
				log.Printf("  ERROR saving AI preview for question %s: %v", question.ID, err)
				totalErrors++
			} else {
				log.Printf("  Successfully created AI preview %s for question %s", createdAIPreview.ID, question.ID)
				totalCreated++
			}

			// Delay of 5 seconds between requests to avoid rate limiting
			log.Printf("  Waiting 5 seconds before next request...")
			time.Sleep(5 * time.Second)
		}
	}

	log.Println("=== AI Preview backfill completed ===")
	log.Printf("Total questions processed: %d", totalProcessed)
	log.Printf("Total AI previews created: %d", totalCreated)
	log.Printf("Total skipped (already had previews): %d", totalSkipped)
	log.Printf("Total errors: %d", totalErrors)
}

// func init() {
// 	go func() {
// 		// time.Sleep(2 * time.Minute)
// 		time.Sleep(15 * time.Second)
// 		BackfillAIPreviews()
// 	}()
// }
