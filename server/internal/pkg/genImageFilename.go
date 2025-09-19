package pkg

import (
	"fmt"
	"time"
)

// GenerateImageFilename creates a filename in the
// format "IMG_YYYYMMDD_HHMMSS_mmm_BiTE.webp"
func GenerateImageFilename() string {
	now := time.Now()

	filename := fmt.Sprintf("IMG_%04d%02d%02d_%02d%02d%02d_%03d_BiTE.webp",
		now.Year(), now.Month(), now.Day(),
		now.Hour(), now.Minute(), now.Second(),
		now.Nanosecond()/1e6, // Convert nanoseconds to milliseconds
	)

	return filename
}
