package sitevisit

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetSiteVisits = func(c *fiber.Ctx) error {
	siteVisit := models.SiteVisit{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allSiteVisits, err := siteVisit.FindAllWithDetails(limit+1, cursorParam)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(allSiteVisits) > int(limit) {
		allSiteVisits = allSiteVisits[:len(allSiteVisits)-1] // Remove last element
		nextCursor = allSiteVisits[len(allSiteVisits)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(allSiteVisits),
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allSiteVisits,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
