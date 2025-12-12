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
		Preload("Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"sequenceNumber\" ASC")
		}).
		First(&question, "id = ?", id)

	return question, nil
}

func (q *Question) FindAllByQuiz(quizID string, limit float64, cursor string) ([]Question, error) {
	var questions []Question

	query := db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"sequenceNumber\" ASC")
		}).
		Order("\"sequenceNumber\" ASC").
		Limit(int(limit))

	if cursor != "" {
		var lastQuestion Question
		if err := db.Select("\"sequenceNumber\"").Where("id = ?",
			cursor).First(&lastQuestion).Error; err != nil {
			return questions, err
		}
		query = query.Where("\"sequenceNumber\" > ?", lastQuestion.SequenceNumber)
	}

	query.Where("\"quizID\" = ?", quizID).Find(&questions)

	return questions, nil
}

func (q *Question) FindAllByQuizForAttempt(quizID string, limit float64, questionCursor string) ([]Question, error) {
	var questions []Question

	query := db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"sequenceNumber\" ASC")
		}).
		Order("\"sequenceNumber\" ASC").
		Limit(int(limit))

	if questionCursor != "" {
		var lastQuestion Question
		if err := db.Select("\"sequenceNumber\"").Where("id = ?",
			questionCursor).First(&lastQuestion).Error; err != nil {
			return questions, err
		}
		query = query.Where("\"sequenceNumber\" > ?", lastQuestion.SequenceNumber)
	}

	query.Where("\"quizID\" = ?", quizID).Find(&questions)

	// Process questions to hide correct answer information
	for i := range questions {
		for j := range questions[i].Answers {
			questions[i].Answers[j].IsCorrect = false

			if questions[i].RequiresNumericalAnswer {
				questions[i].Answers[j].Title = ""
			}
		}
	}

	return questions, nil
}

func (q *Question) FindManyByQuiz(quizID string) ([]Question, error) {
	var questions []Question

	if err := db.Model(&Question{}).
		Where("\"quizID\" = ?", quizID).Find(&questions).Error; err != nil {
		return questions, err
	}

	return questions, nil
}

func (q *Question) SearchByQuiz(quizID string, query string) ([]Question, int, error) {
	var questions []Question
	var QuestionCount int

	sqlQuery := db.Model(&Question{}).
		Preload("Attachments").
		Preload("Answers.Attachments").
		Preload("Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"sequenceNumber\" ASC")
		}).
		Order("\"sequenceNumber\" ASC")

	sqlQuery.Where("\"quizID\" = ? AND \"title\" ILIKE ?",
		quizID, "%"+query+"%").Find(&questions)

	QuestionCount = len(questions)

	return questions, QuestionCount, nil
}

func (q *Question) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&Question{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
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
	questions, err := q.FindManyByQuiz(quizID)
	if err != nil {
		return err
	}

	for _, question := range questions {
		if err := q.Delete(question.ID); err != nil {
			return err
		}
	}

	return nil
}
