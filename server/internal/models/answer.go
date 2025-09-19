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
		Order("\"createdAt\" DESC").Limit(int(limit))

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

	if err := db.Unscoped().Where("\"questionID\" = ?",
		questionID).Delete(&Answer{}).Error; err != nil {
		return err
	}
	return nil
}
