package models

import "time"

var db = Db()

type User struct {
	ID             string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Name           string    `gorm:"column:name;not null;index" json:"name"`
	Password       string    `gorm:"column:password;not null" json:"password"`
	Role           string    `gorm:"column:role;default:'USER';not null;index" json:"role"`
	Email          string    `gorm:"column:email;unique;index" json:"email"`
	Gender         string    `gorm:"column:gender;default:null" json:"gender,omitempty"`
	DateOfBirth    string    `gorm:"column:dateOfBirth;default:null" json:"dateOfBirth,omitempty"`
	Country        string    `gorm:"column:country;default:null" json:"country,omitempty"`
	ImageUrl       string    `gorm:"column:imageUrl;default:null" json:"imageUrl"`
	ImagePath      string    `gorm:"column:imagePath;default:null" json:"imagePath,omitempty"`
	ProfileBgColor string    `gorm:"column:profileBgColor;default:null" json:"profileBgColor"`
	CreatedAt      time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt      time.Time `gorm:"column:updatedAt" json:"updatedAt"`

	// Relationships
	OTPs             []OTP              `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"otps,omitempty"`
	Sessions         []*Session         `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"sessions,omitempty"`
	Locations        []*Location        `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"locations,omitempty"`
	Quizzes          []*Quiz            `gorm:"foreignKey:PostedByUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"quizzes,omitempty"`
	Questions        []*Question        `gorm:"foreignKey:PostedByUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"questions,omitempty"`
	Answers          []*Answer          `gorm:"foreignKey:PostedByUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"answers,omitempty"`
	Attempts         []*Attempt         `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"attempts,omitempty"`
	AttemptDurations []*AttemptDuration `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"attemptDurations,omitempty"`
	SiteVisits       []*SiteVisit       `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"siteVisits,omitempty"`
	Attachments      []*Attachment      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"attachments,omitempty"`
}

type OTP struct {
	ID         string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID     string    `gorm:"column:userID;not null;index" json:"userID"`
	OTP        string    `gorm:"column:OTP;not null;index" json:"OTP"`
	IsUsed     bool      `gorm:"column:isUsed;default:false" json:"isUsed"`
	IsVerified bool      `gorm:"column:isVerified;default:false" json:"isVerified"`
	ExpiresAt  time.Time `gorm:"column:expiresAt;not null;index" json:"expiresAt"`
	CreatedAt  time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
}

type Session struct {
	ID           string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID       string    `gorm:"column:userID;not null;index" json:"userID"`
	AccessToken  string    `gorm:"column:accessToken;not null;index" json:"accessToken"`
	RefreshToken string    `gorm:"column:refreshToken;not null;index" json:"refreshToken"`
	GeneratedVia string    `gorm:"column:generatedVia;not null;index" json:"generatedVia"`
	Device       string    `gorm:"column:Device;default:'Unknown Device';index" json:"device"`
	LocationID   string    `gorm:"column:locationID;default:null" json:"locationID"`
	IsRevoked    bool      `gorm:"column:isRevoked;default:false" json:"isRevoked"`
	CreatedAt    time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt    time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User     *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
	Location *Location `gorm:"foreignKey:LocationID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"location,omitempty"`
}

type Location struct {
	ID        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"column:userID;not null;index" json:"userID"`
	Info      JSONB     `gorm:"column:info;type:jsonb;not null;" json:"info"`
	CreatedAt time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
}

type QuizCategory struct {
	ID        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Name      string    `gorm:"column:name;unique;not null;index" json:"name"`
	CreatedAt time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	Quiz *Quiz `gorm:"foreignKey:QuizCategoryID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"quiz,omitempty"`
}

type Quiz struct {
	ID                string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title             string    `gorm:"column:title;not null;index" json:"title"`
	TitleDelta        string    `gorm:"column:titleDelta;default:null;index" json:"titleDelta"`
	TitleHTML         string    `gorm:"column:titleHTML;default:null;index" json:"titleHTML"`
	Instructions      string    `gorm:"column:instructions;default:null" json:"instructions"`
	InstructionsDelta string    `gorm:"column:instructionsDelta;default:null" json:"instructionsDelta"`
	InstructionsHTML  string    `gorm:"column:instructionsHTML;default:null" json:"instructionsHTML"`
	Introduction      string    `gorm:"column:introduction;default:null" json:"introduction"`
	IntroductionDelta string    `gorm:"column:introductionDelta;default:null" json:"introductionDelta"`
	IntroductionHTML  string    `gorm:"column:introductionHTML;default:null" json:"introductionHTML"`
	IsDeltaDefault    bool      `gorm:"column:isDeltaDefault;default:false;index" json:"isDeltaDefault"`
	PostedByUserID    string    `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	QuizCategoryID    string    `gorm:"column:quizCategoryID;default:null;index" json:"quizCategoryID"`
	StartsAt          time.Time `gorm:"column:startsAt;index" json:"startsAt"`
	EndsAt            time.Time `gorm:"column:endsAt;index" json:"endsAt"`
	CanBeAttempted    bool      `gorm:"column:canBeAttempted;default:false;index" json:"canBeAttempted"`
	CreatedAt         time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt         time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	PostedByUser     *User              `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Questions        []*Question        `gorm:"foreignKey:QuizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"questions"`
	Attachments      []*Attachment      `gorm:"foreignKey:QuizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
	Attempts         []*Attempt         `gorm:"foreignKey:QuizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attempts,omitempty"`
	AttemptDurations []*AttemptDuration `gorm:"foreignKey:QuizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attemptDurations,omitempty"`
	QuizCategory     *QuizCategory      `gorm:"foreignKey:QuizCategoryID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"quizCategory,omitempty"`
}

type Question struct {
	ID                        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title                     string    `gorm:"column:title;not null;index" json:"title"`
	TitleDelta                string    `gorm:"column:titleDelta;default:null;index" json:"titleDelta"`
	TitleHTML                 string    `gorm:"column:titleHTML;default:null;index" json:"titleHTML"`
	Introduction              string    `gorm:"column:introduction;default:null" json:"introduction"`
	IntroductionDelta         string    `gorm:"column:introductionDelta;default:null" json:"introductionDelta"`
	IntroductionHTML          string    `gorm:"column:introductionHTML;default:null" json:"introductionHTML"`
	IsDeltaDefault            bool      `gorm:"column:isDeltaDefault;default:false;index" json:"isDeltaDefault"`
	PostedByUserID            string    `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	QuizID                    string    `gorm:"column:quizID;not null;index" json:"quizID"`
	SequenceNumber            int64     `gorm:"column:sequenceNumber;not null;index" json:"sequenceNumber"`
	HasMultipleCorrectAnswers bool      `gorm:"column:hasMultipleCorrectAnswers;default:false;index" json:"hasMultipleCorrectAnswers"`
	CreatedAt                 time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt                 time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	PostedByUser *User         `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Quiz         *Quiz         `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quiz,omitempty"`
	Answers      []*Answer     `gorm:"foreignKey:QuestionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"answers"`
	Attachments  []*Attachment `gorm:"foreignKey:QuestionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
	Attempts     []*Attempt    `gorm:"foreignKey:QuestionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attempts,omitempty"`
}

type Answer struct {
	ID             string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title          string    `gorm:"column:title;not null;index" json:"title"`
	TitleDelta     string    `gorm:"column:titleDelta;default:null;index" json:"titleDelta"`
	TitleHTML      string    `gorm:"column:titleHTML;default:null;index" json:"titleHTML"`
	IsDeltaDefault bool      `gorm:"column:isDeltaDefault;default:false;index" json:"isDeltaDefault"`
	PostedByUserID string    `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	QuestionID     string    `gorm:"column:questionID;not null;index" json:"questionID"`
	SequenceNumber int64     `gorm:"column:sequenceNumber;not null;index" json:"sequenceNumber"`
	IsCorrect      bool      `gorm:"column:isCorrect;default:false;index" json:"isCorrect"`
	CreatedAt      time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt      time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	PostedByUser *User         `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Question     *Question     `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"question,omitempty"`
	Attachments  []*Attachment `gorm:"foreignKey:AnswerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
	Attempts     []*Attempt    `gorm:"foreignKey:AnswerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attempts,omitempty"`
}

type Attempt struct {
	ID         string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID     string    `gorm:"column:userID;not null;index" json:"userID"`
	QuizID     string    `gorm:"column:quizID;not null;index" json:"quizID"`
	QuestionID string    `gorm:"column:questionID;not null;index" json:"questionID"`
	AnswerID   string    `gorm:"column:answerID;not null;index" json:"answerID"`
	CreatedAt  time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User     *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
	Quiz     *Quiz     `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quiz,omitempty"`
	Question *Question `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"question,omitempty"`
	Answer   *Answer   `gorm:"foreignKey:AnswerID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"answer,omitempty"`
}

type AttemptDuration struct {
	ID        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"column:userID;not null;index" json:"userID"`
	QuizID    string    `gorm:"column:quizID;not null;index" json:"quizID"`
	Duration  int64     `gorm:"column:duration;not null;index" json:"duration"` // Duration in seconds
	CreatedAt time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
	Quiz *Quiz `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quiz,omitempty"`
}

type SiteVisit struct {
	ID         string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID     string    `gorm:"column:userID;default:null;index" json:"userID"`
	Device     string    `gorm:"column:device;default:UNKNOWN" json:"device"`
	Page       string    `gorm:"column:page;not null;index" json:"page"`
	Path       string    `gorm:"column:path;not null;index" json:"path"`
	LocationID string    `gorm:"column:locationID;not null;index" json:"locationID"`
	CapturedAt time.Time `gorm:"column:capturedAt;not null;index" json:"capturedAt"`
	CreatedAt  time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User     *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"user,omitempty"`
	Location *Location `gorm:"foreignKey:LocationID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"location,omitempty"`
}

type Attachment struct {
	ID          string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Type        string    `gorm:"column:type;not null;index" json:"type"` //USER, QUIZ, QUESTION, ANSWER
	UserID      string    `gorm:"column:userID;default:null;index" json:"userID,omitempty"`
	QuizID      string    `gorm:"column:quizID;default:null;index" json:"quizID,omitempty"`
	QuestionID  string    `gorm:"column:questionID;default:null;index" json:"questionID,omitempty"`
	AnswerID    string    `gorm:"column:answerID;default:null;index" json:"answerID,omitempty"`
	Filename    string    `gorm:"column:filename;not null" json:"filename"`
	Url         string    `gorm:"column:url;not null" json:"url"`
	Size        int64     `gorm:"column:size;not null" json:"size"`
	ContentType string    `gorm:"column:contentType;not null" json:"contentType"`
	CreatedAt   time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`

	// Relationships
	User     *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"user,omitempty"`
	Quiz     *Quiz     `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"quiz,omitempty"`
	Question *Question `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"question,omitempty"`
	Answer   *Answer   `gorm:"foreignKey:AnswerID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"answer,omitempty"`
}
