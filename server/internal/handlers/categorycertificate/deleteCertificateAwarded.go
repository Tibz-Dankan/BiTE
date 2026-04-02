package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteCertificateAwarded = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	certificateAwardedID := c.Params("id")

	savedCertificateAwarded, err := certificateAwarded.FindOne(certificateAwardedID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificateAwarded.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Certificate award of provided ID doesn't exist!")
	}

	err = certificateAwarded.Delete(certificateAwardedID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Certificate award deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
