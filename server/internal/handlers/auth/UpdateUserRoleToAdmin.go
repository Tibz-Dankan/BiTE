package auth

import (
	"log"
	"os"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/joho/godotenv"
)

func UpdateUserToAdminRole() {
	user:= models.User{}

	env := os.Getenv("GO_ENV")
	if env == "development" {
		if err := godotenv.Load(); err != nil {
			log.Fatalf("Error loading .env file")
		}
		log.Println("Loaded .env var file")
	}

	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		log.Println("No admin email is provided")
		return
	}

    savedUser, err:= user.FindByEmail(adminEmail)
    if err != nil {
		log.Fatalf("Error loading .env file")
    }

	if savedUser.Role == "ADMIN" {
		log.Printf("%s is already an admin!",savedUser.Name)
		return
    }

	err = savedUser.SetRole("ADMIN")
	if err != nil {
		log.Println(err.Error())
		return
	}

    if savedUser.ID == "" {
		log.Println("User of provided email doesn't exist!")
		return
	}

	err = savedUser.SetRole("ADMIN")
	if err != nil {
		log.Println(err.Error())
		return
	}

	_,err = savedUser.Update()
	if err != nil {
		log.Println(err.Error())
		return
	}

	log.Printf("%s set as ADMIN successfully!",savedUser.Name)
}

func init() {
	UpdateUserToAdminRole()
}




// Prompt

// Given the code "package admin

// import (

// 	"log"

// 	"os"

// 	"github.com/Tibz-Dankan/BiTE/internal/models"

// 	"github.com/joho/godotenv"

// )

// func UpdateUserToAdminRole() {

// 	user:= models.User{}

// 	env := os.Getenv("GO_ENV")

// 	if env == "development" {

// 		if err := godotenv.Load(); err != nil {

// 			log.Fatalf("Error loading .env file")

// 		}

// 		log.Println("Loaded .env var file")

// 	}

// 	adminEmail := os.Getenv("ADMIN_EMAIL")

// 	if adminEmail == "" {

// 		log.Println("No admin email is provided")

// 		return

// 	}

//     savedUser, err:= user.FindByEmail(adminEmail)

//     if err != nil {

// 		log.Fatalf("Error loading .env file")

//     }

// 	if savedUser.Role == "sys_admin" {

// 		log.Printf("%s is already an admin!",savedUser.Name)

// 		return

//     }

// 	err = savedUser.SetRole("sys_admin")

// 	if err != nil {

// 		log.Println(err.Error())

// 		return

// 	}

//     if savedUser.ID == "" {

// 		log.Println("User of provided email doesn't exist!")

// 		return

// 	}

// 	err = savedUser.SetRole("sys_admin")

// 	if err != nil {

// 		log.Println(err.Error())

// 		return

// 	}

// 	err = savedUser.Update()

// 	if err != nil {

// 		log.Println(err.Error())

// 		return

// 	}

// 	log.Printf("%s set as sys_admin successfully!",savedUser.Name)

// }

// func init() {

// 	UpdateUserToAdminRole()

// }", adjust to make sure that the ADMIN_EMAIL is recognized an array of strings