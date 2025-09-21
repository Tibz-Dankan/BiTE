package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (q *Question) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (q *Question) Create(question Question) (Question, error) {
	if err := db.Create(&question).Error; err != nil {
		return question, err
	}

	return question, nil
}

func (q *Question) FindOne(id string) (Question, error) {
	var Question Question

	db.First(&Question, "id = ?", id)

	return Question, nil
}

func (q *Question) FindOneAndIncludeAttachments(id string) (Question, error) {
	var question Question

	db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers").First(&question, "id = ?", id)

	return question, nil
}

func (q *Question) FindAllByQuiz(quizID string, limit float64, cursor string) ([]Question, error) {
	var questions []Question

	query := db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastQuestion Question
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuestion).Error; err != nil {
			return questions, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuestion.CreatedAt)
	}

	query.Where("\"quizID\" = ?", quizID).Find(&questions)

	return questions, nil
}

func (q *Question) SearchByQuiz(quizID string, query string) ([]Question, int, error) {
	var questions []Question
	var QuestionCount int

	sqlQuery := db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers").
		Order("\"createdAt\" DESC")

	sqlQuery.Where("\"quizID\" = ? AND \"title\" ILIKE ?",
		quizID, "%"+query+"%").Find(&questions)

	QuestionCount = len(questions)

	return questions, QuestionCount, nil
}

func (q *Question) Update() (Question, error) {
	db.Save(&q)

	return *q, nil
}

func (q *Question) Delete(id string) error {
	attachment := Attachment{QuestionID: id}
	answer := Answer{QuestionID: id}

	if err := attachment.DeleteByQuestion(id); err != nil {
		return err
	}
	if err := answer.DeleteByQuestion(id); err != nil {
		return err
	}
	if err := db.Unscoped().Where("id = ?", id).Delete(&Question{}).Error; err != nil {
		return err
	}
	return nil
}

func (q *Question) DeleteByQuiz(quizID string) error {

	if err := db.Unscoped().Where("\"quizID\" = ?",
		quizID).Delete(&Question{}).Error; err != nil {
		return err
	}
	return nil
}
