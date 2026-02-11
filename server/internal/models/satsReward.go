package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (sr *SatsReward) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (sr *SatsReward) Create(satsReward SatsReward) (SatsReward, error) {
	result := db.Create(&satsReward)

	if result.Error != nil {
		return satsReward, result.Error
	}
	return satsReward, nil
}

func (sr *SatsReward) FindOne(id string) (SatsReward, error) {
	var satsReward SatsReward
	db.First(&satsReward, "id = ?", id)

	return satsReward, nil
}

func (sr *SatsReward) FindOneAndIncludeUserQuizAndTransaction(id string) (SatsReward, error) {
	var satsReward SatsReward
	db.Model(&SatsReward{}).
		Preload("Quiz.Attachments").
		Preload("Quiz").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "email", "\"profileBgColor\"", "\"createdAt\"", "\"updatedAt\"")
		}).
		Preload("SatsRewardAddress").
		Preload("SatsRewardTransaction").
		First(&satsReward, "id = ?", id)

	return satsReward, nil
}

func (sr *SatsReward) FindOneByUserAndQuiz(userID string, quizID string) (SatsReward, error) {
	var satsReward SatsReward
	db.First(&satsReward, "\"userID\" = ? AND \"quizID\" = ?", userID, quizID)

	return satsReward, nil
}

func (sr *SatsReward) FindAllByUser(userID string, limit float64, cursor string) ([]SatsReward, error) {
	var satsReward []SatsReward

	query := db.Model(&SatsReward{}).
		Preload("Quiz.Attachments").
		Preload("Quiz").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "email", "\"profileBgColor\"", "\"createdAt\"", "\"updatedAt\"")
		}).
		Preload("SatsRewardAddress").
		Preload("SatsRewardTransaction").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsReward SatsReward
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsReward).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsReward.CreatedAt)
	}

	if err := query.Where("\"userID\" = ?", userID).Find(&satsReward).Error; err != nil {
		return nil, err
	}

	return satsReward, nil
}

func (sr *SatsReward) FindAll(limit float64, cursor string) ([]SatsReward, error) {
	var satsRewards []SatsReward

	query := db.Model(&SatsReward{}).
		Preload("Quiz.Attachments").
		Preload("Quiz").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "email", "\"profileBgColor\"", "\"createdAt\"", "\"updatedAt\"")
		}).
		Preload("SatsRewardAddress").
		Preload("SatsRewardTransaction").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsReward SatsReward
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsReward).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsReward.CreatedAt)
	}

	if err := query.Find(&satsRewards).Error; err != nil {
		return nil, err
	}

	return satsRewards, nil
}

// Update updates one Session in the database, using the information
// stored in the receiver u
func (sr *SatsReward) Update() (SatsReward, error) {
	db.Save(&sr)

	satsReward, err := sr.FindOne(sr.ID)
	if err != nil {
		return satsReward, err
	}

	return satsReward, nil
}

func (sr *SatsReward) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&SatsReward{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (sr *SatsReward) GetCorrectQuestionCountForReward(userID string, quizID string) (int64, []string, error) {
	var count int64
	var questionIDs []string
	var correctQuestionIDs []string

	if err := db.Model(&Question{}).
		Select("id").
		Where("\"quizID\" = ?", quizID).
		Pluck("id", &questionIDs).Error; err != nil {
		return 0, nil, err
	}

	if err := db.Model(&AttemptStatus{}).
		Where("\"userID\" = ? AND \"IsCorrect\" = ? AND \"questionID\" IN (?)", userID, true, questionIDs).
		Pluck("questionID", &correctQuestionIDs).Error; err != nil {
		return 0, nil, err
	}

	count = int64(len(correctQuestionIDs))

	return count, correctQuestionIDs, nil
}
