package middlewares

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func LockSignUp(c *fiber.Ctx) error {
	// East African Time (EAT) is UTC+3
	eat := time.FixedZone("EAT", 3*60*60)
	unlockTime := time.Date(2026, time.January, 1, 0, 0, 0, 0, eat)

	if time.Now().In(eat).Compare(unlockTime) >= 0 {
		return c.Next()
	}

	return fiber.NewError(fiber.StatusServiceUnavailable,
		"Sign up is temporarily unavailable. Please try again later.")
}
