package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteCategoryCertificate = func(c *fiber.Ctx) error {
	categoryCertificate := models.CategoryCertificate{}
	certificateAwarded := models.CertificateAwarded{}
	certificateID := c.Params("id")

	savedCertificate, err := categoryCertificate.FindOne(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	awardedCount, err := certificateAwarded.CountByCertificate(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if awardedCount > 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Cannot delete a certificate that has been awarded to users!")
	}

	err = categoryCertificate.Delete(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Category Certificate deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
