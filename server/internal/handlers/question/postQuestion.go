package question

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

var PostQuestion = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	question := models.Question{}
	user := models.User{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	question.PostedByUserID = c.FormValue("postedByUserID")
	question.Title = c.FormValue("title")
	question.Introduction = c.FormValue("introduction")
	question.QuizID = c.FormValue("quizID")
	sequenceNumberStr := c.FormValue("sequenceNumber")
	hasMultipleCorrectAnswersStr := c.FormValue("hasMultipleCorrectAnswers")

	var fileUploaded bool = true

	// TODO: Validate sequence number for uniqueness

	if question.PostedByUserID == "" ||
		question.Title == "" ||
		question.QuizID == "" ||
		sequenceNumberStr == "" ||
		hasMultipleCorrectAnswersStr == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/QuizID/SequenceNumber/HasMultipleCorrectAnswers!")
	}

	parsedSequenceNumber, err := strconv.Atoi(sequenceNumberStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	question.SequenceNumber = int64(parsedSequenceNumber)

	hasMultipleCorrectAnswers, err := strconv.ParseBool(hasMultipleCorrectAnswersStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	question.HasMultipleCorrectAnswers = hasMultipleCorrectAnswers

	user, err = user.FindOne(question.PostedByUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if user.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	quiz, err = quiz.FindOne(question.QuizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
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

		contentType, err := imageProcessor.GetContentTypeFromBinary(imgBuf)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		log.Println("Content Type: ", contentType)

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

		attachment.Type = "QUESTION"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename

		question.Attachments = append(question.Attachments, &attachment)
	}

	newQuestion, err := question.Create(question)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Question created successfully!",
		"data":    newQuestion,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
