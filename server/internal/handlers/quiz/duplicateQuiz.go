package quiz

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var DuplicateQuiz = func(c *fiber.Ctx) error {
	quizID := c.Params("id")
	userID := c.Locals("userID").(string)

	if quizID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz ID is required")
	}

	quizModel := models.Quiz{}
	imageProcessor := pkg.ImageProcessor{}
	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	originalQuiz, err := quizModel.FindOneWithDetailsForDuplication(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Quiz not found")
	}
	newQuiz := models.Quiz{
		Title:             originalQuiz.Title + " (Duplicate)",
		TitleDelta:        originalQuiz.TitleDelta,
		TitleHTML:         originalQuiz.TitleHTML,
		Instructions:      originalQuiz.Instructions,
		InstructionsDelta: originalQuiz.InstructionsDelta,
		InstructionsHTML:  originalQuiz.InstructionsHTML,
		Introduction:      originalQuiz.Introduction,
		IntroductionDelta: originalQuiz.IntroductionDelta,
		IntroductionHTML:  originalQuiz.IntroductionHTML,
		IsDeltaDefault:    originalQuiz.IsDeltaDefault,
		PostedByUserID:    userID,
		QuizCategoryID:    originalQuiz.QuizCategoryID,
		StartsAt:          originalQuiz.StartsAt,
		EndsAt:            originalQuiz.EndsAt,
		CanBeAttempted:    false,
		IsDuplicate:       true,
	}

	duplicateAttachment := func(originalAtt *models.Attachment, refType string) (*models.Attachment, error) {
		if originalAtt == nil {
			return nil, nil
		}

		imgData, err := imageProcessor.GetImageFromURL(originalAtt.Url)
		if err != nil {
			log.Printf("Failed to download image from %s: %v", originalAtt.Url, err)
			return nil, err
		}

		contentType, err := imageProcessor.GetContentTypeFromBinary(imgData)
		if err != nil {
			log.Printf("Failed to detect content type: %v", err)
			return nil, err
		}

		newFilename := pkg.GenerateImageFilename(originalAtt.Filename)
		imgReader := imageProcessor.BinaryToReader(imgData)

		uploadResp, err := newS3Client.AddFile(ctx, imgReader, newFilename, contentType)
		if err != nil {
			log.Printf("Failed to upload to S3: %v", err)
			return nil, err
		}

		return &models.Attachment{
			Type:        refType,
			ContentType: contentType,
			Url:         uploadResp.URL,
			Filename:    uploadResp.Filename,
			Size:        int64(len(imgData)),
		}, nil
	}

	// 3. Duplicate Quiz Attachments
	for _, att := range originalQuiz.Attachments {
		newAtt, err := duplicateAttachment(att, "QUIZ")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to duplicate quiz attachment")
		}
		newQuiz.Attachments = append(newQuiz.Attachments, newAtt)
	}

	// 4. Duplicate Questions
	for _, q := range originalQuiz.Questions {
		newQuestion := models.Question{
			Title:                     q.Title,
			TitleDelta:                q.TitleDelta,
			TitleHTML:                 q.TitleHTML,
			Introduction:              q.Introduction,
			IntroductionDelta:         q.IntroductionDelta,
			IntroductionHTML:          q.IntroductionHTML,
			IsDeltaDefault:            q.IsDeltaDefault,
			PostedByUserID:            userID,
			SequenceNumber:            q.SequenceNumber,
			HasMultipleCorrectAnswers: q.HasMultipleCorrectAnswers,
			RequiresNumericalAnswer:   q.RequiresNumericalAnswer,
		}

		// Duplicate Question Attachments
		for _, att := range q.Attachments {
			newAtt, err := duplicateAttachment(att, "QUESTION")
			if err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, "Failed to duplicate question attachment")
			}
			newQuestion.Attachments = append(newQuestion.Attachments, newAtt)
		}

		// Duplicate Answers
		for _, a := range q.Answers {
			newAnswer := models.Answer{
				Title:          a.Title,
				TitleDelta:     a.TitleDelta,
				TitleHTML:      a.TitleHTML,
				IsDeltaDefault: a.IsDeltaDefault,
				PostedByUserID: userID,
				SequenceNumber: a.SequenceNumber,
				IsCorrect:      a.IsCorrect,
			}

			// Duplicate Answer Attachments
			for _, att := range a.Attachments {
				newAtt, err := duplicateAttachment(att, "ANSWER")
				if err != nil {
					return fiber.NewError(fiber.StatusInternalServerError, "Failed to duplicate answer attachment")
				}
				newAnswer.Attachments = append(newAnswer.Attachments, newAtt)
			}

			newQuestion.Answers = append(newQuestion.Answers, &newAnswer)
		}

		newQuiz.Questions = append(newQuiz.Questions, &newQuestion)
	}

	// 5. Save the new Quiz (Deep creation)
	createdQuiz, err := quizModel.Create(newQuiz)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Failed to create duplicated quiz: %v", err))
	}

	// 6. Record Duplication
	quizDuplicate := models.QuizDuplicate{
		DuplicatedByUserID:   userID,
		DuplicatedFromQuizID: originalQuiz.ID,
		DuplicatedQuizID:     createdQuiz.ID,
		CreatedAt:            time.Now(),
		UpdatedAt:            time.Now(),
	}

	quizDuplicateModel := models.QuizDuplicate{}
	_, err = quizDuplicateModel.Create(quizDuplicate)
	if err != nil {
		log.Printf("Failed to create QuizDuplicate record: %v", err)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz duplicated successfully!",
		"data":    createdQuiz,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
