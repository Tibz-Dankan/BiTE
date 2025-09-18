package models

import "time"

var db = Db()
type User struct {
	ID                   string                `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	Name                 string                `gorm:"column:name;not null;index" json:"name"`
	Password             string                `gorm:"column:password;not null" json:"password"`
	Role                 string                `gorm:"column:role;default:'user';not null" json:"role"`
	Email                string                `gorm:"column:email;index" json:"email"` //Enforce email uniqueness at the application level
	Gender               string                `gorm:"column:gender;default:null" json:"gender"`
	DateOfBirth          string                `gorm:"column:dateOfBirth;default:null" json:"dateOfBirth,omitempty"`
	Country              string                `gorm:"column:country;default:null" json:"country"`
	ImageUrl             string                `gorm:"column:imageUrl;default:null" json:"imageUrl"`
	ImagePath            string                `gorm:"column:imagePath;default:null" json:"imagePath"`
	ProfileBgColor       string                `gorm:"column:profileBgColor;default:null" json:"profileBgColor"`
	OPT                  []OTP                 `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"OPT,omitempty"`
	Session              []*Session            `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"session,omitempty"`               
	CreatedAt            time.Time             `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt            time.Time             `gorm:"column:updatedAt" json:"updatedAt"`
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
	ID               string              `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	UserID           string              `gorm:"column:userID;not null;index" json:"userID"`
	Info             JSONB               `gorm:"column:info;type:jsonb;not null;" json:"info"`
	CreatedAt        time.Time           `gorm:"column:createdAt;index" json:"createdAt"`
	UpdatedAt        time.Time           `gorm:"column:updatedAt;index" json:"updatedAt"`
	User             *User               `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
}
