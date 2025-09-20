package quiz

import (
	"context"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var PostQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	user := models.User{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	quiz.PostedByUserID = c.FormValue("postedByUserID")
	quiz.Title = c.FormValue("title")
	startsAtStr := c.FormValue("startsAt")
	endsAtStr := c.FormValue("endsAt")

	var fileUploaded bool = true

	if quiz.PostedByUserID == "" ||
		quiz.Title == "" ||
		startsAtStr == "" ||
		endsAtStr == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/startsAt/endsAt!")
	}

	user, err = user.FindOne(quiz.PostedByUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if user.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	parsedStartsAt, err := time.Parse(time.RFC3339, startsAtStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid startsAt format! Must be an ISO 8601 string.")
	}
	quiz.StartsAt = parsedStartsAt

	parsedEndsAt, err := time.Parse(time.RFC3339, endsAtStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid endsAt format! Must be an ISO 8601 string.")
	}
	quiz.EndsAt = parsedEndsAt

	now := time.Now()

	if parsedEndsAt.Before(parsedStartsAt) || parsedEndsAt.Equal(parsedStartsAt) {
		return fiber.NewError(fiber.StatusBadRequest,
			"endsAt can't be less or equal to startsAt!")
	}

	if parsedStartsAt.Before(now) || parsedEndsAt.Before(now) {
		return fiber.NewError(fiber.StatusBadRequest,
			"Provided startsAt/endsAt can't be less than current time!")
	}

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

		// // Reset file cursor
		// file.Seek(0, io.SeekStart)

		contentType, err := imageProcessor.GetContentTypeFromBinary(imgBuf)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		log.Println("Content type: ", contentType)

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

		attachment.Type = "QUIZ"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename

		quiz.Attachments = append(quiz.Attachments, &attachment)
	}

	newQuiz, err := quiz.Create(quiz)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz created successfully!",
		"data":    newQuiz,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
