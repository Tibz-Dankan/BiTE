package auth

import (
	"context"
	"io"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var UpdateUserImage = func(c *fiber.Ctx) error {
	user := models.User{}
	attachment := models.Attachment{}
	imageProcessor := pkg.ImageProcessor{}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	user, err = user.FindOne(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if user.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "We couldn't find user of the provided id")
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	// Validate file size (10 MB limit)
	const maxFileSize = 10 << 20 // 10 MB in bytes
	if fileHeader.Size > maxFileSize {
		return fiber.NewError(fiber.StatusBadRequest, "File size exceeds the 10 MB limit")
	}

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
	log.Println("Content type: ", contentType)

	originFilename := fileHeader.Filename
	filename := pkg.GenerateImageFilename(originFilename)
	imgFile := imageProcessor.BinaryToReader(imgBuf)

	savedAttachments, err := attachment.FindAllByUser(user.ID, 100, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var savedAttachment models.Attachment
	for _, att := range savedAttachments {
		if att.Type == "USER" {
			savedAttachment = att
			break
		}
	}

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

		savedAttachment.Type = "USER"
		savedAttachment.ContentType = contentType
		savedAttachment.Url = uploadImageResp.URL
		savedAttachment.Filename = uploadImageResp.Filename
		savedAttachment.Size = fileHeader.Size

		updatedUserAttachment, err := attachment.UpdateFileDetails(savedAttachment)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		user.Attachments = append(user.Attachments, &updatedUserAttachment)
	}

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

		attachment.UserID = user.ID
		attachment.Type = "USER"
		attachment.ContentType = contentType
		attachment.Url = uploadImageResp.URL
		attachment.Filename = uploadImageResp.Filename
		attachment.Size = fileHeader.Size

		newUserAttachment, err := attachment.Create(attachment)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		user.Attachments = append(user.Attachments, &newUserAttachment)
	}

	userMap := map[string]interface{}{
		"id":             user.ID,
		"name":           user.Name,
		"email":          user.Email,
		"role":           user.Role,
		"imageUrl":       user.ImageUrl,
		"profileBgColor": user.ProfileBgColor,
		"createdAt":      user.CreatedAt,
		"updatedAt":      user.UpdatedAt,
		"attachments":    user.Attachments,
	}

	response := fiber.Map{
		"status":  "success",
		"message": "User image updated successfully!",
		"data":    userMap,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
