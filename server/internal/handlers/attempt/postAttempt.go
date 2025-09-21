package attempt

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// ID         string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
// UserID     string    `gorm:"column:userID;not null;index" json:"userID"`
// QuizID     string    `gorm:"column:quizID;not null;index" json:"quizID"`
// QuestionID string    `gorm:"column:questionID;not null;index" json:"questionID"`
// AnswerID   string    `gorm:"column:answerID;not null;index" json:"answerID"`
// CreatedAt  time.Time `gorm:"column:createdAt;index" json:"createdAt"`
// UpdatedAt  time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

var PostAttempt = func(c *fiber.Ctx) error {
	attempt := models.Attempt{}

	if err := c.BodyParser(&attempt); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("attempt: %+v", attempt)

	if attempt.UserID == "" ||
		attempt.QuizID == "" ||
		attempt.QuestionID == "" ||
		attempt.AnswerID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing UserID/QuizID/QuestionID/AnswerID!")
	}

	savedAttempt, err := attempt.FindOneByQuestionAnswerAndUser(attempt.QuestionID,
		attempt.AnswerID, attempt.UserID)
	if err != nil {
		log.Printf("Error getting location ID:  %+v", err)
	}

	if savedAttempt.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have already attempted this question!")
	}

	newAttempt, err := attempt.Create(attempt)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("newAttempt: %+v", newAttempt)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Attempt created successfully!",
		"data":    newAttempt,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
