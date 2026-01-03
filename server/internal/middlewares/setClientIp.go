package middlewares

import (
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func SetClientIp(c *fiber.Ctx) error {
	var clientIP string = ""

	if os.Getenv("GO_ENV") == "production" {
		clientIP = c.Get("CF-Connecting-IP") // Cloudflare's real IP header
		log.Println("IP Cloudflare header: ", clientIP)
	}

	if clientIP == "" {
		forwardedFor := c.Get("X-Forwarded-For")
		if forwardedFor != "" {
			clientIP = strings.Split(forwardedFor, ",")[0]
			log.Println("IP X-Forwarded-For: ", clientIP)
		}
	}

	if clientIP == "" {
		clientIP = c.Get("X-Real-IP")
		log.Println("IP X-Real-IP: ", clientIP)
	}

	if clientIP == "" {
		clientIP = c.IP()
		log.Println("IP default: ", clientIP)
	}

	log.Println("clientIP address:", clientIP)

	c.Locals("clientIP", clientIP)

	return c.Next()
}
