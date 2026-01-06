package auth

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/handlers/location"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var SignUp = func(c *fiber.Ctx) error {
	user := models.User{}
	device := c.Get("X-Device")
	clientIP, ok := c.Locals("clientIP").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Invalid client type!")
	}

	if err := c.BodyParser(&user); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if user.Name == "" || user.Email == "" || user.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing username/email/password!")
	}

	if !user.AgreedTermsOfService {
		return fiber.NewError(fiber.StatusBadRequest, "You must agree to our terms of service to signup for an account!")
	}

	userByEmail, err := user.FindByEmail(user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if userByEmail.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "Email is already registered!")
	}

	err = user.SetRole("USER")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	newUser, err := user.Create(user)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	accessToken, err := pkg.SignJWTToken(newUser.ID, "ACCESS_TOKEN")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	refreshToken, err := pkg.SignJWTToken(newUser.ID, "REFRESH_TOKEN")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	location, err := location.GetUserLocationByIP(newUser.ID, clientIP)
	if err != nil {
		log.Printf("Error getting location ID:  %+v", err)
	}

	session := models.Session{UserID: newUser.ID, AccessToken: accessToken,
		RefreshToken: refreshToken, GeneratedVia: "sign up", Device: device,
		LocationID: location.ID}
	if _, err := session.Create(session); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	newUserResponseData := map[string]interface{}{
		"id":             newUser.ID,
		"name":           newUser.Name,
		"email":          newUser.Email,
		"role":           newUser.Role,
		"imageUrl":       newUser.ImageUrl,
		"profileBgColor": newUser.ProfileBgColor,
		"createdAt":      newUser.CreatedAt,
		"updatedAt":      newUser.UpdatedAt,
	}
	response := map[string]interface{}{
		"status":       "success",
		"message":      "Account created successfully",
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
		"user":         newUserResponseData,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
