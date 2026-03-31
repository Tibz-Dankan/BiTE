package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetCertificateClaimStatus = func(c *fiber.Ctx) error {
	categoryCertificate := models.CategoryCertificate{}
	ccq := models.CategoryCertificateQuizzes{}
	quizUserProgress := models.QuizUserProgress{}
	certificateAwarded := models.CertificateAwarded{}
	attempt := models.Attempt{}

	certificateID := c.Params("id")
	userID := c.Params("userID")

	if certificateID == "" || userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing certificate ID or userID!")
	}

	savedCertificate, err := categoryCertificate.FindOneWithQuizzes(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	certificateQuizzes, err := ccq.FindAllByCertificate(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	claimable := true
	var quizProgresses []map[string]interface{}

	for _, cq := range certificateQuizzes {
		progress, err := quizUserProgress.FindOneByUserQuizAndStatus(userID, cq.QuizID, "COMPLETED")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		isCompleted := progress.ID != ""
		if !isCompleted {
			claimable = false
		}

		quizProgress := map[string]interface{}{
			"quizID":      cq.QuizID,
			"quiz":        cq.Quiz,
			"isCompleted": isCompleted,
		}

		if isCompleted {
			quizProgress["totalQuestions"] = progress.TotalQuestions
			quizProgress["totalAttemptedQuestions"] = progress.TotalAttemptedQuestions
			quizProgress["status"] = progress.Status
		} else {
			// Check if in progress
			inProgress, _ := quizUserProgress.FindOneByUserQuizAndStatus(userID, cq.QuizID, "IN_PROGRESS")
			if inProgress.ID != "" {
				quizProgress["totalQuestions"] = inProgress.TotalQuestions
				quizProgress["totalAttemptedQuestions"] = inProgress.TotalAttemptedQuestions
				quizProgress["status"] = inProgress.Status
			} else {
				quizProgress["totalQuestions"] = 0
				quizProgress["totalAttemptedQuestions"] = 0
				quizProgress["status"] = "UN_ATTEMPTED"
			}
		}

		// Get quiz attempt count
		quizAttemptCount, err := attempt.GetUniqueQuizAttemptCount(cq.QuizID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		quizProgress["attemptCount"] = quizAttemptCount

		quizProgresses = append(quizProgresses, quizProgress)
	}

	// Check if already claimed
	savedCertificateAwarded, err := certificateAwarded.FindByUserAndCertificate(userID,
		certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	isClaimed := savedCertificateAwarded.ID != ""

	response := fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"certificateID":      certificateID,
			"userID":             userID,
			"claimable":          claimable,
			"isClaimed":          isClaimed,
			"quizProgresses":     quizProgresses,
			"certificate":        savedCertificate,
			"certificateAwarded": savedCertificateAwarded,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
