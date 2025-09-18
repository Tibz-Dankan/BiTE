package auth

import (
	"log"
	"os"
	"strings"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/joho/godotenv"
)

func UpdateUserToAdminRole() {
	user := models.User{}
	env := os.Getenv("GO_ENV")
	if env == "development" {
		if err := godotenv.Load(); err != nil {
			log.Fatalf("Error loading .env file")
		}
		log.Println("Loaded .env var file")
	}
	
	adminEmailsStr := os.Getenv("ADMIN_EMAIL")
	if adminEmailsStr == "" {
		log.Println("No admin emails are provided")
		return
	}
	
	adminEmails := strings.Split(adminEmailsStr, ",")
	
	// Process each email
	for _, email := range adminEmails {
		email = strings.TrimSpace(email) 
		if email == "" {
			continue 
		}
		
		processAdminEmail(email, user)
	}
}

func processAdminEmail(adminEmail string, user models.User) {
	savedUser, err := user.FindByEmail(adminEmail)
	if err != nil {
		log.Printf("Error finding user with email %s: %v", adminEmail, err)
		return
	}
	
	if savedUser.ID == "" {
		log.Printf("User with email %s doesn't exist!", adminEmail)
		return
	}
	
	if savedUser.Role == "ADMIN" {
		log.Printf("%s (%s) is already an admin!", savedUser.Name, adminEmail)
		return
	}
	
	err = savedUser.SetRole("ADMIN")
	if err != nil {
		log.Printf("Error setting role for %s: %v", adminEmail, err)
		return
	}
	
	_,err = savedUser.Update()
	if err != nil {
		log.Printf("Error updating user %s: %v", adminEmail, err)
		return
	}
	
	log.Printf("%s (%s) set as ADMIN successfully!", savedUser.Name, adminEmail)
}

func init() {
	UpdateUserToAdminRole()
}