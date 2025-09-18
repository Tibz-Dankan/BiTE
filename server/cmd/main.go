package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Tibz-Dankan/BiTE/internal/handlers/auth"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/health"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/status"
	"github.com/Tibz-Dankan/BiTE/internal/middlewares"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"

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

	// auth
	userGroup := app.Group("/api/v1/user", func(c *fiber.Ctx) error {
		return c.Next()
	})
	userGroup.Post("/auth/signup", auth.SignUp)
	userGroup.Post("/auth/signin", auth.SignIn)
	userGroup.Post("/auth/rt-signin", auth.SignInWithRefreshToken)
	userGroup.Post("/auth/forgot-password", auth.ForgotPassword)
	userGroup.Patch("/auth/verify-otp", auth.VerifyOTP)
	userGroup.Patch("/auth/reset-password/:otp", auth.ResetPassword)
	userGroup.Patch("/:id/auth/change-password", middlewares.Auth, auth.ChangePassword)
	userGroup.Patch("/:id/image", middlewares.Auth, auth.UpdateUserImage)
	userGroup.Patch("/:id", middlewares.Auth, auth.UpdateUser)
	userGroup.Get("/", middlewares.Auth, middlewares.IsAdmin, auth.GetAllUsers)

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
