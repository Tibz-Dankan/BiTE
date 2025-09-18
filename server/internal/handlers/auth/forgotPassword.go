package auth

import (
	"fmt"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var ForgotPassword = func(c *fiber.Ctx) error {
	user := models.User{}
	otp := models.OTP{}

	if err := c.BodyParser(&user); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	userByEmail, err := user.FindByEmail(user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if userByEmail.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "We couldn't find user with provided email!")
	}
	user = userByEmail
	// otp := models.OTP{UserID: user.ID}
	
	// optCode, err := otp.Create(otp)
	optCode, err := otp.Create(models.OTP{UserID: user.ID})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	fmt.Println("OTP:", optCode)
	email := pkg.Email{Recipient: user.Email}
	if err := email.SendResetPassword(user.Name, optCode, "Reset Password"); err != nil {
		log.Println("Error sending reset email:", err)
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	message := fmt.Sprintf("OTP has been sent to %+v", user.Email)

	response := map[string]interface{}{
		"status":  "success",
		"message": message,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
