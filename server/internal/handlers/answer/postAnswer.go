package answer

import (
	"context"
	"fmt"
	"io"
	"log"
	"strconv"

	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var PostAnswer = func(c *fiber.Ctx) error {
	question := models.Question{}
	answer := models.Answer{}
	user := models.User{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	answer.PostedByUserID = c.FormValue("postedByUserID")
	answer.Title = c.FormValue("title")
	answer.TitleDelta = c.FormValue("titleDelta")
	answer.TitleHTML = c.FormValue("titleHTML")
	answer.IsDeltaDefault = true
	answer.QuestionID = c.FormValue("questionID")
	sequenceNumberStr := c.FormValue("sequenceNumber")
	isCorrectStr := c.FormValue("isCorrect")

	var fileUploaded bool = true

	// TODO: Validate sequence number for uniqueness

	if answer.PostedByUserID == "" ||
		answer.Title == "" ||
		answer.QuestionID == "" ||
		sequenceNumberStr == "" ||
		isCorrectStr == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/QuestionID/SequenceNumber/IsCorrectAnswer!")
	}

	parsedSequenceNumber, err := strconv.Atoi(sequenceNumberStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	answer.SequenceNumber = int64(parsedSequenceNumber)

	parsedIsCorrectAnswer, err := strconv.ParseBool(isCorrectStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	answer.IsCorrect = parsedIsCorrectAnswer

	user, err = user.FindOne(answer.PostedByUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if user.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	question, err = question.FindOne(answer.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if question.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
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

		attachment.Type = "ANSWER"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename

		answer.Attachments = append(answer.Attachments, &attachment)
	}

	newAnswer, err := answer.Create(answer)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Answer created successfully!",
		"data":    newAnswer,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
