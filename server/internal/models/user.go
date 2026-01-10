package models

import (
	"errors"

	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (u *User) BeforeCreate(tx *gorm.DB) error {
	hashedPassword, err := u.HashPassword(u.Password)
	if err != nil {
		return err
	}

	profileBgColor, err := pkg.GetRandomColor()
	if err != nil {
		return err
	}

	u.Password = hashedPassword
	u.ProfileBgColor = profileBgColor

	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	if u.ProfileBgColor != "" {
		return nil
	}

	color, err := pkg.GetRandomColor()
	if err != nil {
		return err
	}
	u.ProfileBgColor = color

	return nil
}

func (u *User) Create(user User) (User, error) {
	if err := db.Create(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}

func (u *User) FindOne(id string) (User, error) {
	var user User

	db.First(&user, "id = ?", id)

	return user, nil
}

func (u *User) FindByEmail(email string) (User, error) {
	var user User
	db.First(&user, "email = ?", email)

	return user, nil
}

func (u *User) FindByRole(role string) ([]User, error) {
	var users []User
	db.Find(&users, "role = ?", role)

	return users, nil
}

func (u *User) FindUnknown() (User, error) {
	var user User
	db.First(&user, "email = ?", "unknownuser@mail.com")

	return user, nil
}

func (u *User) FindAll() ([]User, error) {
	var users []User
	db.Find(&users)

	return users, nil
}

func (u *User) FindAllWithDevice(limit int, cursor string, includeCursor bool) ([]User, error) {
	var users []User
	query := db.Preload("Device").Order("\"updatedAt\" DESC").Limit(limit)

	if cursor != "" {
		var lastUser User
		if err := db.Select("\"updatedAt\"").Where("id = ?", cursor).First(&lastUser).Error; err != nil {
			return nil, err
		}
		if includeCursor {
			query = query.Where("\"updatedAt\" <= ?", lastUser.UpdatedAt)
		} else {
			query = query.Where("\"updatedAt\" < ?", lastUser.UpdatedAt)
		}
	}

	if err := query.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// Update updates one user in the database, using the information
// stored in the receiver u
func (u *User) Update() (User, error) {
	db.Save(&u)

	return *u, nil
}

func (u *User) Delete(id string) error {
	db.Delete(&User{}, id)

	return nil
}

// ResetPassword is the method updates user's password in db
func (u *User) ResetPassword(password string) error {
	hashedPassword, err := u.HashPassword(password)
	if err != nil {
		return err
	}

	u.Password = hashedPassword
	db.Save(&u)

	return nil
}

func (u *User) PasswordMatches(plainTextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainTextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}

	return true, nil
}

// Converts plain text password into hashed string
func (u *User) HashPassword(plainTextPassword string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainTextPassword), 12)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

func (u *User) ValidRole(role string) bool {
	roles := []string{"USER", "ADMIN"}

	for _, r := range roles {
		if r == role {
			return true
		}
	}

	return false
}

func (u *User) SetRole(role string) error {
	isValidRole := u.ValidRole(role)

	if !isValidRole {
		return errors.New("invalid user role")
	}

	u.Role = role
	return nil
}

func (u *User) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&User{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// FindAllWithAdminDetails returns users with detailed statistics for admin view
func (u *User) FindAllWithAdminDetails(limit int, cursor string) ([]map[string]interface{}, error) {
	var users []User
	query := db.Model(&User{})

	// Exclude unknown user
	query = query.Where("email != ?", "unknownuser@mail.com")

	query = query.Order("\"createdAt\" DESC").Limit(limit)

	if cursor != "" {
		var lastUser User
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastUser).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastUser.CreatedAt)
	}

	if err := query.Find(&users).Error; err != nil {
		return nil, err
	}

	var result []map[string]interface{}
	for _, user := range users {
		userID := user.ID

		// Rank
		var ranking Ranking
		rank := int64(0)
		if err := db.Where("\"userID\" = ?", userID).First(&ranking).Error; err == nil {
			rank = ranking.Rank
		}

		// Last Session with Location
		var lastSession Session
		var lastSessionData interface{} = nil
		if err := db.Preload("Location").Order("\"createdAt\" DESC").Where("\"userID\" = ?", userID).First(&lastSession).Error; err == nil {
			lastSessionData = lastSession
		}

		// Last Location (Directly from Location table if needed separately, or fallback if session location missing? Request implies separate preload)
		// "user's last location"
		var lastLocation Location
		var lastLocationData interface{} = nil
		if err := db.Order("\"createdAt\" DESC").Where("\"userID\" = ?", userID).First(&lastLocation).Error; err == nil {
			lastLocationData = lastLocation
		}

		// User Quiz Attempt Count (Distinct Quizzes attempted)
		var userQuizAttemptCount int64
		// Using Attempt table to count distinct quizzes
		db.Model(&Attempt{}).Where("\"userID\" = ?", userID).Distinct("quizID").Count(&userQuizAttemptCount)

		// Question Attempt Count (Total attempts)
		var questionAttemptCount int64
		db.Model(&Attempt{}).Where("\"userID\" = ?", userID).Count(&questionAttemptCount)

		// Correct Question Attempt Count
		var correctQuestionAttemptCount int64
		db.Model(&AttemptStatus{}).Where("\"userID\" = ? AND \"IsCorrect\" = ?", userID, true).Count(&correctQuestionAttemptCount)

		// Score Percentage
		scorePercentage := float64(0)
		if questionAttemptCount > 0 {
			scorePercentage = (float64(correctQuestionAttemptCount) / float64(questionAttemptCount)) * 100
		}

		// Total Attempt Duration
		var totalAttemptDuration int64
		// Sum duration from Ranking table or calculate from AttemptDetails?
		// Ranking table has TotalDuration. Request says "total attemmpt duration".
		// I will calculate it from AttemptDuration table to be safe/granular or check Ranking.
		// Ranking has "TotalDuration". I will use AttemptDuration sum to be fresh.
		var totalDurationResult struct {
			TotalDuration int64
		}
		db.Model(&AttemptDuration{}).Select("COALESCE(SUM(duration), 0) as total_duration").Where("\"userID\" = ?", userID).Scan(&totalDurationResult)
		totalAttemptDuration = totalDurationResult.TotalDuration

		// Total Sessions Count
		var totalSessionsCount int64
		db.Model(&Session{}).Where("\"userID\" = ?", userID).Count(&totalSessionsCount)

		// Site Visits Count
		var siteVisitsCount int64
		db.Model(&SiteVisit{}).Where("\"userID\" = ?", userID).Count(&siteVisitsCount)

		userData := map[string]interface{}{
			"id":                          user.ID,
			"name":                        user.Name,
			"email":                       user.Email,
			"role":                        user.Role,
			"gender":                      user.Gender,
			"dateOfBirth":                 user.DateOfBirth,
			"country":                     user.Country,
			"imageUrl":                    user.ImageUrl,
			"imagePath":                   user.ImagePath,
			"profileBgColor":              user.ProfileBgColor,
			"createdAt":                   user.CreatedAt,
			"rank":                        rank,
			"lastSession":                 lastSessionData,
			"lastLocation":                lastLocationData,
			"userQuizAttemptCount":        userQuizAttemptCount,
			"questionAttemptCount":        questionAttemptCount,
			"correctQuestionAttemptCount": correctQuestionAttemptCount,
			"scorePercentage":             scorePercentage,
			"totalAttemptDuration":        totalAttemptDuration,
			"totalSessionsCount":          totalSessionsCount,
			"siteVisitsCount":             siteVisitsCount,
		}
		result = append(result, userData)
	}

	return result, nil
}
