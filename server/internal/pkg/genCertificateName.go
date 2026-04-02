package pkg

import (
	"fmt"
	"strings"
	"time"
)

// GenerateCertificateName returns a certificate file name (with extension)
// in the format: Username_With_Underscores_<unix_timestamp>.<ext>
func GenerateCertificateName(username, certType string) string {
	sanitized := strings.Join(strings.Fields(username), "_")
	ext := ""
	if strings.ToUpper(certType) == "PNG" {
		ext = ".png"
	} else if strings.ToUpper(certType) == "PDF" {
		ext = ".pdf"
	}
	return fmt.Sprintf("%s_%d%s", sanitized, time.Now().Unix(), ext)
}
