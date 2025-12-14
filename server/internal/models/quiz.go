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

	db.Model(&Quiz{}).Preload("Attachments").
		Preload("QuizCategory").First(&quiz, "id = ?", id)

	return quiz, nil
}

func (q *Quiz) FindAll(limit float64, cursor string, quizCategoryID string) ([]Quiz, error) {
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

	if quizCategoryID != "" {
		query = query.Where("\"quizCategoryID\" = ?", quizCategoryID)
	}

	query.Find(&quizzes)

	return quizzes, nil
}

// FindAllWithDetails returns quizzes with additional metadata for user side
// Includes question count, attempt count, and preloaded relationships
func (q *Quiz) FindAllWithDetails(limit float64, cursor string, quizCategoryID string) ([]map[string]interface{}, error) {
	var quizzes []Quiz

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Preload("QuizCategory.Attachments").
		Preload("QuizCategory").
		Preload("PostedByUser").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastQuiz Quiz
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuiz).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuiz.CreatedAt)
	}

	if quizCategoryID != "" {
		query = query.Where("\"quizCategoryID\" = ?", quizCategoryID)
	}

	if err := query.Find(&quizzes).Error; err != nil {
		return nil, err
	}

	// Build result with additional metadata
	var result []map[string]interface{}
	for _, quiz := range quizzes {
		// Count questions for this quiz
		var questionCount int64
		db.Model(&Question{}).Where("\"quizID\" = ?", quiz.ID).Count(&questionCount)

		// Count attempts for this quiz
		var attemptCount int64
		db.Model(&Attempt{}).Where("\"quizID\" = ?", quiz.ID).Distinct("\"userID\"").Count(&attemptCount)

		quizData := map[string]interface{}{
			"id":                quiz.ID,
			"title":             quiz.Title,
			"titleDelta":        quiz.TitleDelta,
			"titleHTML":         quiz.TitleHTML,
			"introduction":      quiz.Introduction,
			"introductionDelta": quiz.IntroductionDelta,
			"introductionHTML":  quiz.IntroductionHTML,
			"instructions":      quiz.Instructions,
			"instructionsDelta": quiz.InstructionsDelta,
			"instructionsHTML":  quiz.InstructionsHTML,
			"isDeltaDefault":    quiz.IsDeltaDefault,
			"postedByUserID":    quiz.PostedByUserID,
			"quizCategoryID":    quiz.QuizCategoryID,
			"startsAt":          quiz.StartsAt,
			"endsAt":            quiz.EndsAt,
			"canBeAttempted":    quiz.CanBeAttempted,
			"createdAt":         quiz.CreatedAt,
			"updatedAt":         quiz.UpdatedAt,
			"attachments":       quiz.Attachments,
			"quizCategory":      quiz.QuizCategory,
			"postedByUser":      quiz.PostedByUser,
			"questionCount":     questionCount,
			"attemptCount":      attemptCount,
		}
		result = append(result, quizData)
	}

	return result, nil
}

func (q *Quiz) FindOneWithQuestionsAndAnswers(quizID string) (Quiz, error) {
	var quiz Quiz

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Preload("Questions", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"questions\".\"createdAt\" ASC")
		}).
		Preload("Questions.Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"answers\".\"createdAt\" ASC")
		})

	if err := query.Where("id = ?", quizID).First(&quiz).Error; err != nil {
		return quiz, err
	}

	return quiz, nil
}

func (q *Quiz) FindOneWithDetailsForDuplication(quizID string) (Quiz, error) {
	var quiz Quiz

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Preload("Questions", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"questions\".\"sequenceNumber\" ASC")
		}).
		Preload("Questions.Attachments").
		Preload("Questions.Answers", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"answers\".\"sequenceNumber\" ASC")
		}).
		Preload("Questions.Answers.Attachments")

	if err := query.Where("id = ?", quizID).First(&quiz).Error; err != nil {
		return quiz, err
	}

	return quiz, nil
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

func (q *Quiz) UpdateCanBeAttempted(id string, canBeAttempted bool) (Quiz, error) {
	var quiz Quiz
	if err := db.Model(&Quiz{}).Where("id = ?", id).Update("\"canBeAttempted\"", canBeAttempted).Error; err != nil {
		return quiz, err
	}

	// Fetch the updated quiz to return it
	// We use FindOne to get the fresh state
	quiz, err := q.FindOne(id)
	if err != nil {
		return quiz, err
	}

	return quiz, nil
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
