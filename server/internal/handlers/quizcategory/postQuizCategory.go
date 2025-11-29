package quizcategory

import (
	"context"
	"fmt"
	"io"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var PostQuizCategory = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	quizCategory.Name = c.FormValue("name")
	quizCategory.Color = c.FormValue("color")

	if quizCategory.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing name for quiz category!")
	}

	if quizCategory.Color == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing quiz color!")
	}

	savedQuizCategory, err := quizCategory.FindByName(quizCategory.Name)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "Provided name already exists!")
	}

	var fileUploaded bool = true

	fileHeader, err := c.FormFile("file")
	if err != nil {
		if err.Error() == constants.NO_FILE_UPLOADED_ERROR {
			fileUploaded = false
			fmt.Println("No file uploaded")
		} else {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
	}

	if fileUploaded {
		// Validate file size (10 MB limit)
		const maxFileSize = 10 << 20 // 10 MB in bytes
		if fileHeader.Size > maxFileSize {
			return fiber.NewError(fiber.StatusBadRequest, "File size exceeds the 10 MB limit")
		}

		attachment.Size = fileHeader.Size
		originalFilename := fileHeader.Filename

		log.Println("originalFilename: ", originalFilename)

		file, err := fileHeader.Open()
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		defer file.Close()

		imgBuf, err := io.ReadAll(file)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		contentType, err := imageProcessor.GetContentTypeFromBinary(imgBuf)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		filename := pkg.GenerateImageFilename(originalFilename)
		imgFile := imageProcessor.BinaryToReader(imgBuf)

		uploadImageResp, err := newS3Client.AddFile(
			ctx,
			imgFile,
			filename,
			contentType,
		)

		if err != nil {
			log.Println("Error uploading image to s3", err)
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		attachment.Type = "QUIZCATEGORY"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename

		quizCategory.Attachments = append(quizCategory.Attachments, &attachment)
	}

	newQuizCategory, err := quizCategory.Create(quizCategory)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category created successfully!",
		"data":    newQuizCategory,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
