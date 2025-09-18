package auth

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/handlers/location"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var SignIn = func(c *fiber.Ctx) error {
	user := models.User{}
	device := c.Get("X-Device")
	clientIP, ok := c.Locals("clientIP").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Invalid client type!")
	}

	if err := c.BodyParser(&user); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	password := user.Password

	userByEmail, err := user.FindByEmail(user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if userByEmail.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid email/password!")
	}
	user = userByEmail

	passwordMatches, err := user.PasswordMatches(password)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if !passwordMatches {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid email/password!")
	}

	accessToken, err := pkg.SignJWTToken(user.ID, "accessToken")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	refreshToken, err := pkg.SignJWTToken(user.ID, "refreshToken")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	location, err := location.GetUserLocationByIP(user.ID, clientIP)
	if err != nil {
		log.Printf("Error getting location ID:  %+v", err)
	}

	session := models.Session{UserID: user.ID, AccessToken: accessToken,
		RefreshToken: refreshToken, GeneratedVia: "sign in", Device: device,
		LocationID: location.ID}
	if _, err := session.Create(session); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	userMap := map[string]interface{}{
		"id":             user.ID,
		"name":           user.Name,
		"email":          user.Email,
		"role":           user.Role,
		"imageUrl":       user.ImageUrl,
		"profileBgColor": user.ProfileBgColor,
		"createdAt":      user.CreatedAt,
		"updatedAt":      user.UpdatedAt,
	}
	response := map[string]interface{}{
		"status":       "success",
		"message":      "Sign in successfully",
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
		"user":         userMap,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
