package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetCertificateAwardByUser = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	certID := c.Params("certID")
	userID := c.Params("userID")

	if certID == "" || userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing certificate ID or userID!")
	}

	award, err := certificateAwarded.FindByUserAndCertificateWithPreloads(userID, certID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if award.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Certificate award not found for the given user and certificate!")
	}

	response := fiber.Map{
		"status": "success",
		"data":   award,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
