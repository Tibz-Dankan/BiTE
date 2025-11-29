package quizcategory

import (
	"context"
	"io"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var UpdateQuizCategoryAttachment = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}
	quizCategoryID := c.Params("id")
	attachmentID := c.Params("attachmentID")

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedQuizCategory, err := quizCategory.FindOne(quizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz Category of provided ID doesn't exist!")
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		if err.Error() == constants.NO_FILE_UPLOADED_ERROR {
			return fiber.NewError(fiber.StatusBadRequest, "No file is uploaded!")
		} else {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	// Validate file size (10 MB limit)
	const maxFileSize = 10 << 20 // 10 MB in bytes
	if fileHeader.Size > maxFileSize {
		return fiber.NewError(fiber.StatusBadRequest, "File size exceeds the 10 MB limit")
	}

	attachment.Size = fileHeader.Size
	originFilename := fileHeader.Filename

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

	filename := pkg.GenerateImageFilename(originFilename)
	imgFile := imageProcessor.BinaryToReader(imgBuf)

	savedAttachment, err := attachment.FindOne(attachmentID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Update existing attachment
	if savedAttachment.ID != "" {
		uploadImageResp, err := newS3Client.UpdateFile(
			ctx,
			imgFile,
			filename,
			savedAttachment.Filename,
			contentType,
		)
		if err != nil {
			log.Println("Error uploading image to s3", err)
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		savedAttachment.Type = "QUIZCATEGORY"
		savedAttachment.ContentType = contentType
		savedAttachment.Url = uploadImageResp.URL
		savedAttachment.Filename = uploadImageResp.Filename
		savedAttachment.Size = attachment.Size

		updatedAttachment, err := savedAttachment.UpdateFileDetails(savedAttachment)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		savedQuizCategory.Attachments = append(savedQuizCategory.Attachments, &updatedAttachment)
	}

	// Add new attachment
	if savedAttachment.ID == "" {
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

		attachment.QuizCategoryID = savedQuizCategory.ID
		attachment.Type = "QUIZCATEGORY"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename

		newAttachment, err := attachment.Create(attachment)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		savedQuizCategory.Attachments = append(savedQuizCategory.Attachments, &newAttachment)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category Attachment Updated successfully!",
		"data":    savedQuizCategory,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
