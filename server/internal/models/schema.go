package models

import "time"

var db = Db()

type User struct {
	ID             string     `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Name           string     `gorm:"column:name;not null;index" json:"name"`
	Password       string     `gorm:"column:password;not null" json:"password"`
	Role           string     `gorm:"column:role;default:'user';not null" json:"role"`
	Email          string     `gorm:"column:email;unique;index" json:"email"` //Enforce email uniqueness at the application level
	Gender         string     `gorm:"column:gender;default:null" json:"gender"`
	DateOfBirth    string     `gorm:"column:dateOfBirth;default:null" json:"dateOfBirth,omitempty"`
	Country        string     `gorm:"column:country;default:null" json:"country"`
	ImageUrl       string     `gorm:"column:imageUrl;default:null" json:"imageUrl"`
	ImagePath      string     `gorm:"column:imagePath;default:null" json:"imagePath"`
	ProfileBgColor string     `gorm:"column:profileBgColor;default:null" json:"profileBgColor"`
	OPT            []OTP      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"OPT,omitempty"`
	Session        []*Session `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"session,omitempty"`
	CreatedAt      time.Time  `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt      time.Time  `gorm:"column:updatedAt" json:"updatedAt"`
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
	User         *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
	Location     *Location `gorm:"foreignKey:LocationID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"location,omitempty"`
}

type Location struct {
	ID        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"column:userID;not null;index" json:"userID"`
	Info      JSONB     `gorm:"column:info;type:jsonb;not null;" json:"info"`
	CreatedAt time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`
	User      *User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
}

type Quiz struct {
	ID             string        `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title          string        `gorm:"column:title;not null;index" json:"title"`
	PostedByUserID string        `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	AttachmentID   string        `gorm:"column:attachmentID;default:null" json:"attachmentID"`
	StartsAt       time.Time     `gorm:"column:startsAt;index" json:"startsAt"`
	EndsAt         time.Time     `gorm:"column:endsAt;index" json:"endsAt"`
	CanBeAttempted bool          `gorm:"column:canBeAttempted;default:false;index" json:"canBeAttempted"`
	CreatedAt      time.Time     `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt      time.Time     `gorm:"column:updatedAt;index" json:"updatedAt"`
	PostedByUser   *User         `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Attachments    []*Attachment `gorm:"foreignKey:AttachmentID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
}

type Question struct {
	ID                        string        `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title                     string        `gorm:"column:title;not null;index" json:"title"`
	PostedByUserID            string        `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	QuizID                    string        `gorm:"column:quizID;not null;index" json:"quizID"`
	AttachmentID              string        `gorm:"column:attachmentID;default:null" json:"attachmentID"`
	SequenceNumber            int64         `gorm:"column:sequenceNumber;not null;index" json:"sequenceNumber"`
	HasMultipleCorrectAnswers bool          `gorm:"column:hasMultipleCorrectAnswers;default:false;index" json:"hasMultipleCorrectAnswers"`
	CreatedAt                 time.Time     `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt                 time.Time     `gorm:"column:updatedAt;index" json:"updatedAt"`
	PostedByUser              *User         `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Quiz                      *Quiz         `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quiz,omitempty"`
	Attachments               []*Attachment `gorm:"foreignKey:AttachmentID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
}

type Answer struct {
	ID             string        `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Title          string        `gorm:"column:title;not null;index" json:"title"`
	PostedByUserID string        `gorm:"column:postedByUserID;not null;index" json:"postedByUserID"`
	QuestionID     string        `gorm:"column:questionID;not null;index" json:"questionID"`
	AttachmentID   string        `gorm:"column:attachmentID;default:null" json:"attachmentID"`
	SequenceNumber int64         `gorm:"column:sequenceNumber;not null;index" json:"sequenceNumber"`
	IsCorrect      bool          `gorm:"column:isCorrect;default:false;index" json:"isCorrect"`
	CreatedAt      time.Time     `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt      time.Time     `gorm:"column:updatedAt;index" json:"updatedAt"`
	PostedByUser   *User         `gorm:"foreignKey:PostedByUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"postedByUser,omitempty"`
	Question       *Question     `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quiz,omitempty"`
	Attachments    []*Attachment `gorm:"foreignKey:AttachmentID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"attachments"`
}

type Attempt struct {
	ID         string      `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID     string      `gorm:"column:userID;not null;index" json:"userID,omitempty"`
	QuizID     string      `gorm:"column:quizID;not null;index" json:"quizID,omitempty"`
	QuestionID string      `gorm:"column:questionID;not null;index" json:"questionID,omitempty"`
	AnswerID   string      `gorm:"column:answerID;not null;index" json:"answerID,omitempty"`
	CreatedAt  time.Time   `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time   `gorm:"column:updatedAt;index" json:"updatedAt"`
	User       []*User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"users,omitempty"`
	Quiz       []*Quiz     `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quizzes,omitempty"`
	Question   []*Question `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"questions,omitempty"`
	Answer     []*Answer   `gorm:"foreignKey:AnswerID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"answers,omitempty"`
}

type AttemptDuration struct {
	ID        string    `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"column:userID;not null;index" json:"userID,omitempty"`
	QuizID    string    `gorm:"column:quizID;not null;index" json:"quizID,omitempty"`
	Duration  int64     `gorm:"column:duration;not null;index" json:"duration"` // Duration in seconds
	CreatedAt time.Time `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;index" json:"updatedAt"`
	User      []*User   `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"users,omitempty"`
	Quiz      []*Quiz   `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quizzes,omitempty"`
}

type SiteVisits struct {
	ID         string      `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID     string      `gorm:"column:userID;default:null;index" json:"userID"`
	Device     string      `gorm:"column:device;default:UNKNOWN" json:"device"`
	Page       string      `gorm:"column:device;not null;index" json:"page"`
	Path       string      `gorm:"column:path;not null;index" json:"path"`
	LocationID string      `gorm:"column:locationID;not null;index" json:"locationID"`
	CapturedAt time.Time   `gorm:"column:capturedAt;not null;index" json:"capturedAt"`
	CreatedAt  time.Time   `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time   `gorm:"column:updatedAt;index" json:"updatedAt"`
	User       []*User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"users,omitempty"`
	Location   []*Location `gorm:"foreignKey:LocationID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"locations,omitempty"`
}

type Attachment struct {
	ID         string      `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Type       string      `gorm:"column:type;not null;index" json:"type"`
	UserID     string      `gorm:"column:userID;default:null;index" json:"userID,omitempty"`
	QuizID     string      `gorm:"column:quizID;default:null;index" json:"quizID,omitempty"`
	QuestionID string      `gorm:"column:questionID;default:null;index" json:"questionID,omitempty"`
	AnswerID   string      `gorm:"column:answerID;default:null;index" json:"answerID,omitempty"`
	Filename   string      `gorm:"column:filename;not null" json:"filename"`
	Url        string      `gorm:"column:url;not null" json:"url"`
	Size       int64       `gorm:"column:size;not null" json:"size"`
	CreatedAt  time.Time   `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt  time.Time   `gorm:"column:updatedAt;index" json:"updatedAt"`
	User       []*User     `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"users,omitempty"`
	Quiz       []*Quiz     `gorm:"foreignKey:QuizID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"quizzes,omitempty"`
	Question   []*Question `gorm:"foreignKey:QuestionID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"questions,omitempty"`
	Answer     []*Answer   `gorm:"foreignKey:AnswerID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"answers,omitempty"`
}
