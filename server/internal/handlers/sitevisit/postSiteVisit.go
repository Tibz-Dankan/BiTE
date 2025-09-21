package sitevisit

import (
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/handlers/location"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type PostSiteVisitInput struct {
	Page       string `json:"page"`
	Path       string `json:"path"`
	CapturedAt string `json:"capturedAt"`
}

var PostSiteVisit = func(c *fiber.Ctx) error {
	siteVisit := models.SiteVisit{}
	siteVisitInput := PostSiteVisitInput{}
	device := c.Get("X-Device")

	if err := c.BodyParser(&siteVisitInput); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	clientIP, ok := c.Locals("clientIP").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Invalid client type!")
	}

	userID, ok := c.Locals("userID").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Invalid userID type!")
	}

	location, err := location.GetUserLocationByIP(userID, clientIP)
	if err != nil {
		log.Printf("Error getting location ID:  %+v", err)
	}

	parsedCapturedAt, err := time.Parse(time.RFC3339, siteVisitInput.CapturedAt)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid capturedAt format! Must be an ISO 8601 string.")
	}

	siteVisit.UserID = userID
	siteVisit.LocationID = location.ID
	siteVisit.Device = device
	siteVisit.Page = siteVisitInput.Page
	siteVisit.Path = siteVisitInput.Path
	siteVisit.CapturedAt = parsedCapturedAt

	newSiteVisit, err := siteVisit.Create(siteVisit)
	if err != nil {
		log.Printf("Error getting location ID:  %+v", err)
	}

	log.Printf("newSiteVisit: %+v", newSiteVisit)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Visit created successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
