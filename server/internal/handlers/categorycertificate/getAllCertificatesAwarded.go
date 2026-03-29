package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllCertificatesAwarded = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allCertificates, err := certificateAwarded.FindAll(limit+1, cursorParam)
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
