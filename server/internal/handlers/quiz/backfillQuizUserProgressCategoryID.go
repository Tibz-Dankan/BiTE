package quiz

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
)

func BackfillQuizUserProgressCategoryID() {
	log.Println("Starting backfill of quiz user progress category IDs...")

	batchSize := float64(500)
	// batchSize := float64(10000)
	cursor := ""
	totalUpdated := 0
	totalSkipped := 0

	for {
		qupModel := models.QuizUserProgress{}
		quizUserProgresses, err := qupModel.FindAllAndIncludeQuizCategory(batchSize, cursor)
		if err != nil {
			log.Printf("Error fetching quiz user progresses: %v", err)
			return
		}

		if len(quizUserProgresses) == 0 {
			break
		}

		for _, qup := range quizUserProgresses {
			// Skip if quizCategoryID is already set
			if qup.QuizCategoryID != "" {
				totalSkipped++
				continue
			}

			// Skip if Quiz or QuizCategory is not preloaded
			if qup.Quiz == nil || qup.Quiz.QuizCategory == nil {
				totalSkipped++
				continue
			}

			quizCategoryID := qup.Quiz.QuizCategory.ID
			if quizCategoryID == "" {
				totalSkipped++
				continue
			}

			qupModel := models.QuizUserProgress{}
			if err := qupModel.UpdateQuizCategoryID(qup.ID, quizCategoryID); err != nil {
				log.Printf("Error updating quizCategoryID for quiz user progress %s: %v", qup.ID, err)
				continue
			}
			log.Printf("Updated quizCategoryID for quiz user progress %s: %s", qup.ID, quizCategoryID)

			totalUpdated++
		}

		// Set cursor to the last item's ID for the next batch
		cursor = quizUserProgresses[len(quizUserProgresses)-1].ID

		// If we got fewer results than the batch size, we've reached the end
		if len(quizUserProgresses) < int(batchSize) {
			break
		}
	}

	log.Printf("Backfill completed. Updated %d quiz user progress records. Skipped %d records.", totalUpdated, totalSkipped)
}

// func init() {
// 	go func() {
// 		time.Sleep(1 * time.Minute)
// 		// time.Sleep(15 * time.Second)
// 		BackfillQuizUserProgressCategoryID()
// 	}()
// }
