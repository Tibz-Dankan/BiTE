package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetCertificatesAwardedByUser = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	userID := c.Params("userID")
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	if userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing userID!")
	}

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allCertificates, err := certificateAwarded.FindAllByUser(userID, limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(allCertificates) > int(limit) {
		allCertificates = allCertificates[:len(allCertificates)-1] // Remove last element
		nextCursor = allCertificates[len(allCertificates)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(allCertificates),
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allCertificates,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
