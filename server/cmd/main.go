package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Tibz-Dankan/hackernoon-articles/internal/handlers/health"
	"github.com/Tibz-Dankan/hackernoon-articles/internal/handlers/status"
	"github.com/Tibz-Dankan/hackernoon-articles/internal/middlewares"
	"github.com/Tibz-Dankan/hackernoon-articles/internal/pkg"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	app := fiber.New(fiber.Config{
		ErrorHandler: pkg.DefaultErrorHandler,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:  "*",
		AllowHeaders:  "Origin, Content-Type, Accept, Authorization",
		ExposeHeaders: "Content-Length",
	}))

	app.Use(logger.New())

	app.Use(middlewares.RateLimit)

	// Load dev .env file
	env := os.Getenv("GO_ENV")
	if env == "development" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalf("Error loading .env file")
		}
		log.Println("Loaded .env var file")
	}

	// Status
	app.Get("/status", status.GetAppStatus)

	// Health
	app.Get("/health", health.CheckHealth)

	app.Use("*", func(c *fiber.Ctx) error {
		message := fmt.Sprintf("api route '%s' doesn't exist!", c.Path())
		return fiber.NewError(fiber.StatusNotFound, message)
	})


	log.Fatal(app.Listen("0.0.0.0:3000"))
}
