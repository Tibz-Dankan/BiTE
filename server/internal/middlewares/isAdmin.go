package middlewares

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

func IsAdmin(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Invalid user type!")
	}

	if user.Role!="ADMIN" {
		return fiber.NewError(fiber.StatusForbidden, "You don't have permission to perform this action!")
	}

	c.Locals("userID", user.ID)
	c.Locals("user", user)
	return c.Next()
}