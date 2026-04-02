package categorycertificate

import (
	"bytes"
	"encoding/base64"
	"html/template"
	"log"
	"os"
	"path/filepath"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
)

type CertificateInfo struct {
	RecipientName        string
	CategoryName         string
	QuestionsCompleted   int
	Exams                string
	Quizzes              []models.Quiz
	SignedBy             string
	Organization         string
	LogoImageBase64      string
	SignatureImageBase64 string
}

type Certificate struct {
	Info CertificateInfo
}

// HTMLToPDF generates a PDF from the certificate template
func (e *Certificate) HTMLToPDF(data CertificateInfo) ([]byte, error) {
	logoPath, err := filepath.Abs("./internal/assets/images/bite-logo.png")
	if err != nil {
		log.Println("Error finding absolute path for logo image:", err)
		return nil, err
	}
	logoBytes, err := os.ReadFile(logoPath)
	if err != nil {
		log.Println("Error reading logo image:", err)
		return nil, err
	}

	sigPath, err := filepath.Abs("./internal/assets/images/mmk-signature.png")
	if err != nil {
		log.Println("Error finding absolute path for signature image:", err)
		return nil, err
	}
	sigBytes, err := os.ReadFile(sigPath)
	if err != nil {
		log.Println("Error reading signature image:", err)
		return nil, err
	}

	data.LogoImageBase64 = base64.StdEncoding.EncodeToString(logoBytes)
	data.SignatureImageBase64 = base64.StdEncoding.EncodeToString(sigBytes)

	templatePath, err := filepath.Abs("./internal/templates/certificate/certificate-light-theme.html")
	if err != nil {
		log.Println("Error finding absolute path for certificate template:", err)
		return nil, err
	}

	funcMap := template.FuncMap{
		"inc": func(i int) int {
			return i + 1
		},
	}
	tmpl, err := template.New(filepath.Base(templatePath)).Funcs(funcMap).ParseFiles(templatePath)
	if err != nil {
		log.Println("Error parsing certificate template:", err)
		return nil, err
	}

	var body bytes.Buffer
	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Println("Error executing certificate template:", err)
		return nil, err
	}

	renderer, err := pkg.NewChromedpRenderer(pkg.Options{
		Headless: true,
	})
	if err != nil {
		log.Println("Error initializing renderer:", err)
		return nil, err
	}

	pdfBytes, err := renderer.HTMLToPDF(body.String())
	if err != nil {
		log.Println("Error generating pdf:", err)
		return nil, err
	}

	return pdfBytes, nil
}

// HTMLToPNG generates a PNG from the certificate template
func (e *Certificate) HTMLToPNG(data CertificateInfo) ([]byte, error) {
	logoPath, err := filepath.Abs("./internal/assets/images/bite-logo.png")
	if err != nil {
		log.Println("Error finding absolute path for logo image:", err)
		return nil, err
	}
	logoBytes, err := os.ReadFile(logoPath)
	if err != nil {
		log.Println("Error reading logo image:", err)
		return nil, err
	}

	sigPath, err := filepath.Abs("./internal/assets/images/mmk-signature.png")
	if err != nil {
		log.Println("Error finding absolute path for signature image:", err)
		return nil, err
	}
	sigBytes, err := os.ReadFile(sigPath)
	if err != nil {
		log.Println("Error reading signature image:", err)
		return nil, err
	}

	data.LogoImageBase64 = base64.StdEncoding.EncodeToString(logoBytes)
	data.SignatureImageBase64 = base64.StdEncoding.EncodeToString(sigBytes)

	templatePath, err := filepath.Abs("./internal/templates/certificate/certificate-light-theme.html")
	if err != nil {
		log.Println("Error finding absolute path for certificate template:", err)
		return nil, err
	}

	funcMap := template.FuncMap{
		"inc": func(i int) int {
			return i + 1
		},
	}
	tmpl, err := template.New(filepath.Base(templatePath)).Funcs(funcMap).ParseFiles(templatePath)
	if err != nil {
		log.Println("Error parsing certificate template:", err)
		return nil, err
	}

	var body bytes.Buffer
	err = tmpl.Execute(&body, data)
	if err != nil {
		return nil, err
	}

	renderer, err := pkg.NewChromedpRenderer(pkg.Options{
		Headless: true,
	})
	if err != nil {
		return nil, err
	}

	pngBytes, err := renderer.HTMLToPNG(body.String())
	if err != nil {
		return nil, err
	}

	return pngBytes, nil
}
