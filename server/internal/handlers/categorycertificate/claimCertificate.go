package categorycertificate

import (
	"encoding/json"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var ClaimCertificate = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	categoryCertificate := models.CategoryCertificate{}
	ccq := models.CategoryCertificateQuizzes{}
	quizUserProgress := models.QuizUserProgress{}

	if err := c.BodyParser(&certificateAwarded); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if certificateAwarded.UserID == "" || certificateAwarded.CategoryCertificateID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing userID or categoryCertificateID!")
	}

	user := models.User{}
	savedUser, err := user.FindOne(certificateAwarded.UserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedUser.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	savedCertificate, err := categoryCertificate.FindOne(certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	existingAward, err := certificateAwarded.FindByUserAndCertificate(
		certificateAwarded.UserID, certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if existingAward.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have already claimed this certificate!")
	}

	certificateQuizzes, err := ccq.FindAllByCertificate(certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if len(certificateQuizzes) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "No quizzes are linked to this certificate!")
	}

	var awardedQuizIDs []string
	for _, cq := range certificateQuizzes {
		progress, err := quizUserProgress.FindOneByUserQuizAndStatus(
			certificateAwarded.UserID, cq.QuizID, "COMPLETED")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		if progress.ID == "" {
			return fiber.NewError(fiber.StatusBadRequest,
				"You must complete all quizzes in this certificate before claiming it!")
		}
		awardedQuizIDs = append(awardedQuizIDs, cq.QuizID)
	}

	awardedQuizIDsJSON, err := json.Marshal(awardedQuizIDs)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	certificateAwarded.AwardedQuizIDs = models.JSONB(awardedQuizIDsJSON)

	newAward, err := certificateAwarded.Create(certificateAwarded)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Certificate claimed successfully!",
		"data":    newAward,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
