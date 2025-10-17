package auth

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
)

func UpdateUserRoleToUppercase() {
	user := models.User{}

	savedUsers, err := user.FindByRole("user")
	if err != nil {
		log.Printf("Error finding user with email %s: %v", "user", err)
		return
	}

	for _, savedUser := range savedUsers {
		if savedUser.ID == "" {
			log.Printf("User with role %s doesn't exist!", "user")
			return
		}

		if savedUser.Role == "USER" {
			log.Printf("%s (%s) role is already uppercase!", savedUser.Name, savedUser.Email)
			return
		}

		err = savedUser.SetRole("USER")
		if err != nil {
			log.Printf("Error setting role for user %s: %v", savedUser.Name, err)
			return
		}
		_, err = savedUser.Update()
		if err != nil {
			log.Printf("Error updating user %s: %v", savedUser.Name, err)
			return
		}
	}
	log.Printf("All users with role 'user' have been updated to 'USER' successfully!")
}

// func init() {
// 	UpdateUserRoleToUppercase()
// }
