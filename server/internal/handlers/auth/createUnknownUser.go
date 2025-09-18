package auth

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
)

func CreateUnknownUser() {
	user := models.User{Name: "Unknown", Role: "UNKNOWN",
		Email:    "unknownuser@mail.com",
		Password: pkg.NewRandomNumber().D10()}

	userSaved, err := user.FindByEmail(user.Email)
	if err != nil {
		log.Printf("Error finding unknown user: %v", err)
		return
	}

	if userSaved.ID != "" {
		log.Printf("Unknown user already exists: %+v", userSaved)
		return
	}

	newUser, err := user.Create(user)
	if err != nil {
		log.Printf("Error creating unknown user: %v", err)
		return
	}
	log.Printf("New Unknown User Created Successfully: %+v", newUser)
}

func init() {
	CreateUnknownUser()
}
