package middlewares

import (
	"github.com/gofiber/fiber/v2"
)

func LockSignUp(c *fiber.Ctx) error {
	return fiber.NewError(fiber.StatusServiceUnavailable,
		"Sign up is temporarily unavailable. Please try again later.")
}
