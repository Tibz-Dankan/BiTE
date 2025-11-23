package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (q *Quiz) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (q *Quiz) Create(Quiz Quiz) (Quiz, error) {
	if err := db.Create(&Quiz).Error; err != nil {
		return Quiz, err
	}
	return Quiz, nil
}

func (q *Quiz) FindOne(id string) (Quiz, error) {
	var quiz Quiz

	db.First(&quiz, "id = ?", id)

	return quiz, nil
}

func (q *Quiz) FindOneAndIncludeAttachments(id string) (Quiz, error) {
	var quiz Quiz

	db.Model(&Quiz{}).Preload("Attachments").First(&quiz, "id = ?", id)

	return quiz, nil
}

func (q *Quiz) FindAll(limit float64, cursor string) ([]Quiz, error) {
	var quizzes []Quiz

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastQuiz Quiz
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuiz).Error; err != nil {
			return quizzes, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuiz.CreatedAt)
	}

	query.Find(&quizzes)

	return quizzes, nil
}

func (q *Quiz) Search(query string) ([]Quiz, int, error) {
	var Quizzes []Quiz
	var quizCount int

	result := db.Model(&Quiz{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").
		Where("\"title\" ILIKE ?", "%"+query+"%").
		Find(&Quizzes)

	if result.Error != nil {
		return Quizzes, quizCount, result.Error
	}

	quizCount = len(Quizzes)

	return Quizzes, quizCount, nil
}

func (q *Quiz) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&Quiz{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (q *Quiz) Update() (Quiz, error) {
	db.Save(&q)

	return *q, nil
}

func (q *Quiz) Delete(id string) error {
	attachment := Attachment{QuizID: id}
	question := Question{QuizID: id}

	if err := attachment.DeleteByQuiz(id); err != nil {
		return err
	}
	if err := question.DeleteByQuiz(id); err != nil {
		return err
	}

	if err := db.Unscoped().Where("id = ?", id).Delete(&Quiz{}).Error; err != nil {
		return err
	}
	return nil
}
