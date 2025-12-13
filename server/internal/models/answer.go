package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (a *Answer) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (a *Answer) Create(answer Answer) (Answer, error) {
	if err := db.Create(&answer).Error; err != nil {
		return answer, err
	}

	return answer, nil
}

func (a *Answer) FindOne(id string) (Answer, error) {
	var answer Answer

	db.First(&answer, "id = ?", id)

	return answer, nil
}

func (a *Answer) FindOneAndIncludeAttachments(id string) (Answer, error) {
	var answer Answer

	db.Model(&Answer{}).Preload("Attachments").First(&answer, "id = ?", id)

	return answer, nil
}

func (a *Answer) FindAllByQuestion(questionID string, limit float64, cursor string) ([]Answer, error) {
	var answers []Answer

	query := db.Model(&Answer{}).
		Preload("Attachments").
		Order("\"sequenceNumber\" ASC").Limit(int(limit))

	if cursor != "" {
		var lastAnswer Answer
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastAnswer).Error; err != nil {
			return answers, err
		}
		query = query.Where("\"createdAt\" < ?", lastAnswer.CreatedAt)
	}

	query.Where("\"questionID\" = ?", questionID).Find(&answers)

	return answers, nil
}

func (a *Answer) FindManyByQuestion(questionID string) ([]Answer, error) {
	var answers []Answer
	if err := db.Model(&Answer{}).Where("\"questionID\" = ?", questionID).
		Find(&answers).Error; err != nil {
		return answers, err
	}

	return answers, nil
}

func (a *Answer) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&Answer{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (a *Answer) Update() (Answer, error) {
	db.Save(&a)

	return *a, nil
}

func (a *Answer) Delete(id string) error {
	attachment := Attachment{AnswerID: id}

	if err := attachment.DeleteByAnswer(id); err != nil {
		return err
	}
	if err := db.Unscoped().Where("id = ?", id).Delete(&Answer{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *Answer) DeleteByQuestion(questionID string) error {
	answers, err := a.FindManyByQuestion(questionID)
	if err != nil {
		return err
	}
	for _, answer := range answers {
		if err := a.Delete(answer.ID); err != nil {
			return err
		}
	}

	return nil
}

// AutoCorrectSequenceNumbers reorders all answers for a question to have consecutive sequence numbers
// Example: 1, 2, 3, 5, 6, 7 becomes 1, 2, 3, 4, 5, 6
func (a *Answer) AutoCorrectSequenceNumbers(questionID string) error {
	var answers []Answer

	// Fetch all answers for the question ordered by current sequence number
	if err := db.Model(&Answer{}).
		Where("\"questionID\" = ?", questionID).
		Order("\"sequenceNumber\" ASC").
		Find(&answers).Error; err != nil {
		return err
	}

	// Renumber answers starting from 1
	for i, answer := range answers {
		newSequenceNumber := int64(i + 1)
		if answer.SequenceNumber != newSequenceNumber {
			if err := db.Model(&Answer{}).
				Where("id = ?", answer.ID).
				Update("\"sequenceNumber\"", newSequenceNumber).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

// GetNextSequenceNumber returns the next available sequence number for a new answer in the given question
func (a *Answer) GetNextSequenceNumber(questionID string) (int64, error) {
	var maxSequenceNumber int64

	err := db.Model(&Answer{}).
		Where("\"questionID\" = ?", questionID).
		Select("COALESCE(MAX(\"sequenceNumber\"), 0)").
		Scan(&maxSequenceNumber).Error

	if err != nil {
		return 0, err
	}

	return maxSequenceNumber + 1, nil
}
