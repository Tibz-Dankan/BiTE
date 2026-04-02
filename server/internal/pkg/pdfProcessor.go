package pkg

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"
)

type PDFProcessor struct{}

// FileToBytes converts a multipart.File PDF to []byte
func (pp *PDFProcessor) FileToBytes(file multipart.File) ([]byte, error) {
	data, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}
	return data, nil
}

// ToBase64 converts PDF []byte data to a Base64 string
func (pp *PDFProcessor) ToBase64(data []byte) string {
	return base64.StdEncoding.EncodeToString(data)
}

// ConvertBase64ToBytes converts a Base64 string to PDF []byte data
func (pp *PDFProcessor) ConvertBase64ToBytes(base64String string) ([]byte, error) {
	pdfBytes, err := base64.StdEncoding.DecodeString(base64String)
	if err != nil {
		return nil, err
	}
	return pdfBytes, nil
}

// GetPDFFromURL downloads a PDF from the given URL
// and returns the PDF data as bytes
func (pp *PDFProcessor) GetPDFFromURL(url string) ([]byte, error) {
	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch PDF from URL: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch PDF: HTTP %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType != "" && !isPDFContentType(contentType) {
		return nil, fmt.Errorf("URL does not point to a PDF, content-type: %s", contentType)
	}

	pdfData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read PDF data: %w", err)
	}

	return pdfData, nil
}

// GetContentTypeFromBinary detects whether the binary data is a PDF
// by examining the file signature (magic bytes)
func (pp *PDFProcessor) GetContentTypeFromBinary(data []byte) (string, error) {
	if len(data) == 0 {
		return "", fmt.Errorf("empty data provided")
	}

	// PDF files start with "%PDF-"
	if len(data) >= 5 && bytes.Equal(data[:5], []byte("%PDF-")) {
		return "application/pdf", nil
	}

	return "", fmt.Errorf("data is not a valid PDF format")
}

// IsPDF checks if the binary data is a valid PDF by examining magic bytes
func (pp *PDFProcessor) IsPDF(data []byte) bool {
	return len(data) >= 5 && bytes.Equal(data[:5], []byte("%PDF-"))
}

// BinaryToReader converts PDF binary data ([]byte) to io.Reader
func (pp *PDFProcessor) BinaryToReader(data []byte) io.Reader {
	return bytes.NewReader(data)
}

// GetSize returns the size of the PDF data in bytes
func (pp *PDFProcessor) GetSize(data []byte) int64 {
	return int64(len(data))
}

// ToDataURI converts PDF []byte data to a data URI string
// suitable for embedding in HTML or email
func (pp *PDFProcessor) ToDataURI(data []byte) string {
	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:application/pdf;base64,%s", encoded)
}

// MergePages concatenates multiple PDF byte slices into a single slice.
// Note: This performs a naive byte concatenation. For proper PDF merging
// with page structure, use a dedicated PDF library.
func (pp *PDFProcessor) MergeBytes(pdfs ...[]byte) []byte {
	var merged []byte
	for _, pdf := range pdfs {
		merged = append(merged, pdf...)
	}
	return merged
}

func isPDFContentType(contentType string) bool {
	pdfTypes := []string{
		"application/pdf",
		"application/x-pdf",
	}

	for _, pdfType := range pdfTypes {
		if contentType == pdfType {
			return true
		}
	}
	return false
}
