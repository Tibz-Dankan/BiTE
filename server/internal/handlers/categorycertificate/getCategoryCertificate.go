package categorycertificate

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetCategoryCertificate = func(c *fiber.Ctx) error {
	categoryCertificate := models.CategoryCertificate{}
	certificateID := c.Params("id")

	savedCertificate, err := categoryCertificate.FindOneWithQuizzes(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Category Certificate fetched successfully!",
		"data":    savedCertificate,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
