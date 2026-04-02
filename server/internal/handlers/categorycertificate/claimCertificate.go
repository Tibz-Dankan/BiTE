package categorycertificate

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var ClaimCertificate = func(c *fiber.Ctx) error {
	certificateAwarded := models.CertificateAwarded{}
	categoryCertificate := models.CategoryCertificate{}
	ccq := models.CategoryCertificateQuizzes{}
	quizUserProgress := models.QuizUserProgress{}
	attachment := models.Attachment{}

	if err := c.BodyParser(&certificateAwarded); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if certificateAwarded.UserID == "" || certificateAwarded.CategoryCertificateID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing userID or categoryCertificateID!")
	}

	ctx := context.Background()
	s3Client := pkg.S3Client{}
	newS3Client, err := s3Client.NewS3Client(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	imageProcessor := pkg.ImageProcessor{}
	pdfProcessor := pkg.PDFProcessor{}

	user := models.User{}
	savedUser, err := user.FindOne(certificateAwarded.UserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedUser.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	savedCertificate, err := categoryCertificate.FindOneWithQuizCategory(certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	existingAward, err := certificateAwarded.FindByUserAndCertificate(
		certificateAwarded.UserID, certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if existingAward.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have already claimed this certificate!")
	}

	certificateQuizzes, err := ccq.FindAllByCertificate(certificateAwarded.CategoryCertificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if len(certificateQuizzes) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "No quizzes are linked to this certificate!")
	}

	var awardedQuizIDs []string
	var quizzes []models.Quiz
	questionsCompleted := 0
	for _, cq := range certificateQuizzes {
		progress, err := quizUserProgress.FindOneByUserQuizAndStatus(
			certificateAwarded.UserID, cq.QuizID, "COMPLETED")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		if progress.ID == "" {
			return fiber.NewError(fiber.StatusBadRequest,
				"You must complete all quizzes in this certificate before claiming it!")
		}
		awardedQuizIDs = append(awardedQuizIDs, cq.QuizID)
		quizzes = append(quizzes, *cq.Quiz)
		questionsCompleted += len(cq.Quiz.Questions)
	}

	awardedQuizIDsJSON, err := json.Marshal(awardedQuizIDs)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	certificateAwarded.AwardedQuizIDs = models.JSONB(awardedQuizIDsJSON)

	newAward, err := certificateAwarded.Create(certificateAwarded)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Generate and Upload certificates to AWS S3
	certificate := Certificate{}
	signedBy := "Maali Marvin, CEO"
	organization := "Bitcoin High School"
	exams := len(quizzes)
	pdfFilename := pkg.GenerateCertificateName(savedUser.Name, "PDF")
	pdfFilePath := fmt.Sprintf("certificates/%s", pdfFilename)

	// Generate PDF and Upload to AWS S3
	certPdfBuf, err := certificate.HTMLToPDF(CertificateInfo{
		RecipientName:      savedUser.Name,
		CategoryName:       savedCertificate.QuizCategory.Name,
		Quizzes:            quizzes,
		QuestionsCompleted: questionsCompleted,
		SignedBy:           signedBy,
		Organization:       organization,
		Exams:              fmt.Sprintf("%d BiTEs", exams),
	})

	pdfContentType, err := pdfProcessor.GetContentTypeFromBinary(certPdfBuf)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	log.Println("PDF Content type: ", pdfContentType)

	pdfFile := pdfProcessor.BinaryToReader(certPdfBuf)

	uploadCertificatePDFResp, err := newS3Client.AddFile(
		ctx,
		pdfFile,
		pdfFilePath, // In for the filename
		pdfContentType,
	)

	if err != nil {
		log.Println("Error uploading pdf certificate to s3", err)
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	newCertificatePDFAttachment, err := attachment.Create(models.Attachment{
		Type:        "CERTIFICATE_PDF",
		ContentType: pdfContentType,
		Url:         uploadCertificatePDFResp.URL,
		Filename:    uploadCertificatePDFResp.Filename,
		Size:        int64(len(certPdfBuf)),
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	newAward.Attachments = append(newAward.Attachments, &newCertificatePDFAttachment)
	log.Printf("New certificate PDF attachment: %+v\n", newCertificatePDFAttachment)

	pngFilename := pkg.GenerateCertificateName(savedUser.Name, "PNG")
	pngFilePath := fmt.Sprintf("certificates/%s", pngFilename)

	// Generate PNG and Upload to AWS S3
	certPngBuf, err := certificate.HTMLToPNG(CertificateInfo{
		RecipientName:      savedUser.Name,
		CategoryName:       savedCertificate.QuizCategory.Name,
		Quizzes:            quizzes,
		QuestionsCompleted: questionsCompleted,
		SignedBy:           signedBy,
		Organization:       organization,
		Exams:              fmt.Sprintf("%d BiTEs", exams),
	})

	pngContentType, err := imageProcessor.GetContentTypeFromBinary(certPngBuf)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	log.Println("PNG Content type: ", pngContentType)
	// pngContentType := "image/png"

	pngFile := imageProcessor.BinaryToReader(certPngBuf)

	uploadCertificatePNGResp, err := newS3Client.AddFile(
		ctx,
		pngFile,
		pngFilePath, // In for the filename
		pngContentType,
	)

	if err != nil {
		log.Println("Error uploading png certificate to s3", err)
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	newCertificatePNGAttachment, err := attachment.Create(models.Attachment{
		Type:        "CERTIFICATE_PNG",
		ContentType: pngContentType,
		Url:         uploadCertificatePNGResp.URL,
		Filename:    uploadCertificatePNGResp.Filename,
		Size:        int64(len(certPngBuf)),
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	newAward.Attachments = append(newAward.Attachments, &newCertificatePNGAttachment)
	log.Printf("New certificate PNG attachment: %+v\n", newCertificatePNGAttachment)

	response := fiber.Map{
		"status":  "success",
		"message": "Certificate claimed successfully!",
		"data":    newAward,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
