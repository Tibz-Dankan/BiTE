package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (qup *QuizUserProgress) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (qup *QuizUserProgress) Create(quizUserProgress QuizUserProgress) (QuizUserProgress, error) {
	if err := db.Create(&quizUserProgress).Error; err != nil {
		return quizUserProgress, err
	}

	return quizUserProgress, nil
}

func (qup *QuizUserProgress) FindOne(id string) (QuizUserProgress, error) {
	var quizUserProgress QuizUserProgress

	db.First(&quizUserProgress, "id = ?", id)

	return quizUserProgress, nil
}

func (qup *QuizUserProgress) FindOneByUserQuizAndStatus(userID string, quizID string, status string) (QuizUserProgress, error) {
	var quizUserProgress QuizUserProgress

	if err := db.Model(&QuizUserProgress{}).
		Where("\"userID\" = ? AND \"quizID\" = ? AND \"status\" = ?",
			userID, quizID, status).
		First(&quizUserProgress).Error; err != nil && err != gorm.ErrRecordNotFound {
		return quizUserProgress, err
	}

	return quizUserProgress, nil
}

func (qup *QuizUserProgress) FindAll(limit float64, cursor string) ([]QuizUserProgress, error) {
	var quizUserProgress []QuizUserProgress

	query := db.Model(&QuizUserProgress{}).
		Preload("User").
		Preload("Quiz").
		Limit(int(limit))

	if cursor != "" {
		var lastQuizUserProgress QuizUserProgress
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuizUserProgress).Error; err != nil {
			return quizUserProgress, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuizUserProgress.CreatedAt)
	}

	query.Find(&quizUserProgress)

	return quizUserProgress, nil
}

func (qup *QuizUserProgress) FindAllByUser(userID string, status string, limit float64, cursor string) ([]QuizUserProgress, error) {
	var quizUserProgress []QuizUserProgress

	query := db.Model(&QuizUserProgress{}).
		Preload("Quiz.Attachments").
		Preload("Quiz.QuizCategory.Attachments").
		Preload("Quiz.QuizCategory").
		Preload("Quiz.PostedByUser").
		Preload("Quiz").
		Order("\"createdAt\" DESC").
		// Distinct("\"quizID\"").
		Limit(int(limit))

	if cursor != "" {
		var lastQuizUserProgress QuizUserProgress
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuizUserProgress).Error; err != nil {
			return quizUserProgress, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuizUserProgress.CreatedAt)
	}

	query.Where("\"userID\" = ? AND \"status\" = ?", userID, status).Find(&quizUserProgress)

	return quizUserProgress, nil
}

// func (qup *QuizUserProgress) FindAllByUser(userID string, status string, limit float64, cursor string) ([]QuizUserProgress, error) {
// 	var quizUserProgress []QuizUserProgress

// 	query := db.Model(&QuizUserProgress{}).
// 		Preload("Quiz.Attachments").
// 		Preload("Quiz.QuizCategory.Attachments").
// 		Preload("Quiz.QuizCategory").
// 		Preload("Quiz.PostedByUser").
// 		Preload("Quiz").
// 		Select("DISTINCT ON (\"quizID\") *").
// 		Order("\"quizID\", \"createdAt\" DESC").
// 		Limit(int(limit))

// 	if cursor != "" {
// 		var lastQuizUserProgress QuizUserProgress
// 		if err := db.Select("\"createdAt\"").Where("id = ?",
// 			cursor).First(&lastQuizUserProgress).Error; err != nil {
// 			return quizUserProgress, err
// 		}
// 		query = query.Where("\"createdAt\" < ?", lastQuizUserProgress.CreatedAt)
// 	}

// 	query.Where("\"userID\" = ? AND \"status\" = ?", userID, status).Find(&quizUserProgress)

// 	return quizUserProgress, nil
// }

// FindOneByQuizAndUser fetches QuizUserProgress by quizID and userID
// and is not supposed to include an preload
func (qup *QuizUserProgress) FindOneByQuizAndUser(quizID string, userID string) (QuizUserProgress, error) {
	var quizUserProgress QuizUserProgress

	db.Model(&QuizUserProgress{}).
		Where("\"userID\" = ? AND \"quizID\" = ?", userID, quizID).Find(&quizUserProgress)

	return quizUserProgress, nil
}

func (qup *QuizUserProgress) GetTotalCountByStatusAndUser(userID string, status string) (int64, error) {
	var count int64

	if err := db.Model(&QuizUserProgress{}).Where("\"userID\" = ? AND \"status\" = ?",
		userID, status).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (qup *QuizUserProgress) GetTotalCountOfUnattemptedQuizzesByUser(userID string) (int64, error) {
	var count int64
	var userAttemptedQuizIDs []string

	if err := db.Model(&QuizUserProgress{}).
		Select("quizID").
		Where("\"userID\" = ?", userID).
		Pluck("quizID", &userAttemptedQuizIDs).Error; err != nil {
		return count, err
	}

	query := db.Model(&Quiz{}).Where("\"showQuiz\" = ? AND \"canBeAttempted\" = ?", true, true)

	if len(userAttemptedQuizIDs) > 0 {
		query = query.Where("\"id\" NOT IN ?", userAttemptedQuizIDs)
	}

	if err := query.Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (qup *QuizUserProgress) Update() (QuizUserProgress, error) {
	db.Save(&qup)

	return *qup, nil
}

func (qup *QuizUserProgress) Delete(id string) error {
	if err := db.Unscoped().Where("id = ?", id).Delete(&QuizUserProgress{}).Error; err != nil {
		return err
	}
	return nil
}
