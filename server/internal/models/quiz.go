package models

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/types"
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
func (q *Quiz) FindAllWithDetails(limit float64, cursor string, quizCategoryID string, userID string) ([]map[string]interface{}, error) {
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
		// Count attempts for this quiz
		var attemptCount int64
		db.Model(&Attempt{}).Where("\"quizID\" = ?", quiz.ID).Distinct("\"userID\"").Count(&attemptCount)

		// Get user progress
		var attempt Attempt
		totalQuestions, totalAttemptedQuestions, status, err := attempt.FindProgressByQuizAndUser(quiz.ID, userID)
		if err != nil {
			totalAttemptedQuestions = 0
			status = "NOT_STARTED"
		}

		userProgress := map[string]interface{}{
			"totalQuestions":          totalQuestions,
			"totalAttemptedQuestions": totalAttemptedQuestions,
			"status":                  status,
		}

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
			"showQuiz":          quiz.ShowQuiz,
			"createdAt":         quiz.CreatedAt,
			"updatedAt":         quiz.UpdatedAt,
			"attachments":       quiz.Attachments,
			"quizCategory":      quiz.QuizCategory,
			"postedByUser":      quiz.PostedByUser,
			"questionCount":     totalQuestions,
			"attemptCount":      attemptCount,
			"userProgress":      userProgress,
		}
		result = append(result, quizData)
	}

	return result, nil
}

// FindAllWithDetailsForUser returns quizzes with additional metadata for user side, filtering out hidden quizzes
func (q *Quiz) FindAllWithDetailsForUser(limit float64, cursor string, quizCategoryID string, userID string) ([]map[string]interface{}, error) {
	var quizzes []Quiz

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Preload("QuizCategory.Attachments").
		Preload("QuizCategory").
		Preload("PostedByUser").
		Where("\"showQuiz\" = ?", true).
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
		// Count attempts for this quiz
		var attemptCount int64
		db.Model(&Attempt{}).Where("\"quizID\" = ?", quiz.ID).Distinct("\"userID\"").Count(&attemptCount)

		// Get user progress
		var attempt Attempt
		totalQuestions, totalAttemptedQuestions, status, err := attempt.FindProgressByQuizAndUser(quiz.ID, userID)
		if err != nil {
			totalAttemptedQuestions = 0
			status = "IN_PROGRESS"
		}

		userProgress := map[string]interface{}{
			"totalQuestions":          totalQuestions,
			"totalAttemptedQuestions": totalAttemptedQuestions,
			"status":                  status,
		}

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
			"showQuiz":          quiz.ShowQuiz,
			"createdAt":         quiz.CreatedAt,
			"updatedAt":         quiz.UpdatedAt,
			"attachments":       quiz.Attachments,
			"quizCategory":      quiz.QuizCategory,
			"postedByUser":      quiz.PostedByUser,
			"questionCount":     totalQuestions,
			"attemptCount":      attemptCount,
			"userProgress":      userProgress,
		}
		result = append(result, quizData)
	}

	return result, nil
}

func (q *Quiz) FindAllByUserProgressWithStatusValue(limit float64, cursor string, userID string, status string) (types.Pagination, []map[string]interface{}, error) {
	quizUserProgressModel := QuizUserProgress{}
	var pagination types.Pagination

	quizUserProgresses, err := quizUserProgressModel.FindAllByUser(userID, status, limit+1, cursor)
	if err != nil {
		return pagination, nil, err
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(quizUserProgresses) > int(limit) {
		quizUserProgresses = quizUserProgresses[:len(quizUserProgresses)-1] // Remove last element
		nextCursor = quizUserProgresses[len(quizUserProgresses)-1].ID
		hasNextItems = true
	}

	pagination = types.Pagination{
		Limit:        int64(limit),
		NextCursor:   nextCursor,
		HasNextItems: hasNextItems,
		Count:        int64(len(quizUserProgresses)),
	}

	// Build result with additional metadata
	var result []map[string]interface{}

	for _, quizUserProgress := range quizUserProgresses {
		// Count attempts for this quiz
		var attemptCount int64
		db.Model(&Attempt{}).Where("\"quizID\" = ?", quizUserProgress.Quiz.ID).Distinct("\"userID\"").Count(&attemptCount)

		userProgress := map[string]interface{}{
			"totalQuestions":          quizUserProgress.TotalQuestions,
			"totalAttemptedQuestions": quizUserProgress.TotalAttemptedQuestions,
			"status":                  quizUserProgress.Status,
		}

		quizData := map[string]interface{}{
			"id":                quizUserProgress.Quiz.ID,
			"title":             quizUserProgress.Quiz.Title,
			"titleDelta":        quizUserProgress.Quiz.TitleDelta,
			"titleHTML":         quizUserProgress.Quiz.TitleHTML,
			"introduction":      quizUserProgress.Quiz.Introduction,
			"introductionDelta": quizUserProgress.Quiz.IntroductionDelta,
			"introductionHTML":  quizUserProgress.Quiz.IntroductionHTML,
			"instructions":      quizUserProgress.Quiz.Instructions,
			"instructionsDelta": quizUserProgress.Quiz.InstructionsDelta,
			"instructionsHTML":  quizUserProgress.Quiz.InstructionsHTML,
			"isDeltaDefault":    quizUserProgress.Quiz.IsDeltaDefault,
			"postedByUserID":    quizUserProgress.Quiz.PostedByUserID,
			"quizCategoryID":    quizUserProgress.Quiz.QuizCategoryID,
			"startsAt":          quizUserProgress.Quiz.StartsAt,
			"endsAt":            quizUserProgress.Quiz.EndsAt,
			"canBeAttempted":    quizUserProgress.Quiz.CanBeAttempted,
			"showQuiz":          quizUserProgress.Quiz.ShowQuiz,
			"createdAt":         quizUserProgress.Quiz.CreatedAt,
			"updatedAt":         quizUserProgress.Quiz.UpdatedAt,
			"attachments":       quizUserProgress.Quiz.Attachments,
			"quizCategory":      quizUserProgress.Quiz.QuizCategory,
			"postedByUser":      quizUserProgress.Quiz.PostedByUser,
			"questionCount":     quizUserProgress.TotalQuestions,
			"attemptCount":      attemptCount,
			"userProgress":      userProgress,
		}
		result = append(result, quizData)
	}

	return pagination, result, nil
}

// FindAllByUserProgressWithNoStatusValue returns quizzes with additional metadata for user side, filtering out hidden quizzes
func (q *Quiz) FindAllByUserProgressWithNoStatusValue(limit float64, cursor string, userID string) (types.Pagination, []map[string]interface{}, error) {
	var quizzes []Quiz
	var pagination types.Pagination
	var quizIDsWithStatus []string

	// Get all quizIDsWithStatus for this user
	if err := db.Model(&QuizUserProgress{}).
		Select("quizID").
		Where("\"userID\" = ?", userID).
		Pluck("quizID", &quizIDsWithStatus).Error; err != nil {
		return pagination, nil, err
	}

	query := db.Model(&Quiz{}).
		Preload("Attachments").
		Preload("QuizCategory.Attachments").
		Preload("QuizCategory").
		Preload("PostedByUser").
		Where("\"showQuiz\" = ?", true).
		Order("\"createdAt\" DESC").Limit(int(limit + 1))

	if cursor != "" {
		var lastQuiz Quiz
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuiz).Error; err != nil {
			return pagination, nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuiz.CreatedAt)
	}

	log.Printf("quizIDsWithStatus: %+v", quizIDsWithStatus)

	if len(quizIDsWithStatus) > 0 {
		query = query.Where("id NOT IN ?", quizIDsWithStatus)
	}

	if err := query.Find(&quizzes).Error; err != nil {
		return pagination, nil, err
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(quizzes) > int(limit) {
		quizzes = quizzes[:len(quizzes)-1] // Remove last element
		nextCursor = quizzes[len(quizzes)-1].ID
		hasNextItems = true
	}

	pagination = types.Pagination{
		Limit:        int64(limit),
		NextCursor:   nextCursor,
		HasNextItems: hasNextItems,
		Count:        int64(len(quizzes)),
	}

	// Build result with additional metadata
	var result []map[string]interface{}
	for _, quiz := range quizzes {
		// Count attempts for this quiz
		var attemptCount int64
		db.Model(&Attempt{}).Where("\"quizID\" = ?", quiz.ID).Distinct("\"userID\"").Count(&attemptCount)

		// Get user progress
		var attempt Attempt
		totalQuestions, totalAttemptedQuestions, status, err := attempt.FindProgressByQuizAndUser(quiz.ID, userID)
		if err != nil {
			totalAttemptedQuestions = 0
			status = "NOT_STARTED"
		}

		userProgress := map[string]interface{}{
			"totalQuestions":          totalQuestions,
			"totalAttemptedQuestions": totalAttemptedQuestions,
			"status":                  status,
		}

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
			"showQuiz":          quiz.ShowQuiz,
			"createdAt":         quiz.CreatedAt,
			"updatedAt":         quiz.UpdatedAt,
			"attachments":       quiz.Attachments,
			"quizCategory":      quiz.QuizCategory,
			"postedByUser":      quiz.PostedByUser,
			"questionCount":     totalQuestions,
			"attemptCount":      attemptCount,
			"userProgress":      userProgress,
		}
		result = append(result, quizData)
	}

	return pagination, result, nil
}

func (q *Quiz) FindAllByUserProgress(limit float64, cursor string, userID string, status string) (types.Pagination, []map[string]interface{}, error) {
	var pagination types.Pagination
	// Build result with additional metadata
	var result []map[string]interface{}
	var err error

	if status == "IN_PROGRESS" || status == "COMPLETED" {
		pagination, result, err = q.FindAllByUserProgressWithStatusValue(limit, cursor, userID, status)
		if err != nil {
			return pagination, result, err
		}
		return pagination, result, nil
	}

	pagination, result, err = q.FindAllByUserProgressWithNoStatusValue(limit, cursor, userID)
	if err != nil {
		return pagination, result, err
	}

	return pagination, result, nil
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

func (q *Quiz) UpdateShowQuiz(id string, showQuiz bool) (Quiz, error) {
	var quiz Quiz
	if err := db.Model(&Quiz{}).Where("id = ?", id).Update("\"showQuiz\"", showQuiz).Error; err != nil {
		return quiz, err
	}

	// Fetch the updated quiz to return it
	// We use FindOne to get the fresh state
	quiz, err := q.FindOneAndIncludeAttachments(id)
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
