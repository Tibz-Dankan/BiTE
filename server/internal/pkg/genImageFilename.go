package pkg

import (
	"fmt"
	"path/filepath"
	"time"
)

// GenerateImageFilename creates a filename in the
// format "IMG_YYYYMMDD_HHMMSS_mmm_BiTE.webp"
func GenerateImageFilename(originalFilename string) string {
	now := time.Now()
	ext := filepath.Ext(originalFilename)
	if ext == "" {
		ext = "webp"
	}

	filename := fmt.Sprintf("IMG_%04d%02d%02d_%02d%02d%02d_%03d_BiTE%s",
		now.Year(), now.Month(), now.Day(),
		now.Hour(), now.Minute(), now.Second(),
		now.Nanosecond()/1e6, // Convert nanoseconds to milliseconds
		ext,
	)

	return filename
}
