package middlewares

import (
	"github.com/gofiber/fiber/v2"
)

func LockSignUp(c *fiber.Ctx) error {

	response := map[string]interface{}{
		"status":  "error",
		"Message": "Sign up is temporarily unavailable. Please try again later.",
	}
	return c.Status(fiber.StatusServiceUnavailable).JSON(response)
}
