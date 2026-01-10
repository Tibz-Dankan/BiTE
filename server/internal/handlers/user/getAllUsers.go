package user

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllUsers = func(c *fiber.Ctx) error {
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	userModel := models.User{}
	users, err := userModel.FindAllWithAdminDetails(int(limit)+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(users) > int(limit) {
		users = users[:len(users)-1] // Remove last element
		nextCursor = users[len(users)-1]["id"].(string)
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(users),
	}

	response := fiber.Map{
		"status":     "success",
		"message":    "Users fetched successfully",
		"data":       users,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
