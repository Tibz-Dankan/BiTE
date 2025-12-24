package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Tibz-Dankan/BiTE/internal/events/subscribers"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/analytics"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/answer"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/attempt"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/attemptduration"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/auth"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/health"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/monitor"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/question"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/quiz"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/quizcategory"
	"github.com/Tibz-Dankan/BiTE/internal/handlers/sitevisit"
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
		AllowHeaders:  "Origin, Content-Type, Accept, Authorization, X-Device",
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
	userGroup.Post("/auth/signup", middlewares.LockSignUp, auth.SignUp)
	// userGroup.Post("/auth/signup", auth.SignUp)
	userGroup.Post("/auth/signin", auth.SignIn)
	userGroup.Post("/auth/rt-signin", auth.SignInWithRefreshToken)
	userGroup.Post("/auth/forgot-password", auth.ForgotPassword)
	userGroup.Patch("/auth/verify-otp", auth.VerifyOTP)
	userGroup.Patch("/auth/reset-password/:otp", auth.ResetPassword)
	userGroup.Patch("/:id/auth/change-password", middlewares.Auth, auth.ChangePassword)
	userGroup.Patch("/:id/image", middlewares.Auth, auth.UpdateUserImage)
	userGroup.Patch("/:id", middlewares.Auth, auth.UpdateUser)
	userGroup.Get("/", middlewares.Auth, middlewares.IsAdmin, auth.GetAllUsers)

	// Quiz Category
	quizCategoryGroup := app.Group("/api/v1/quizcategory", func(c *fiber.Ctx) error {
		return c.Next()
	})
	quizCategoryGroup.Post("/", middlewares.Auth, middlewares.IsAdmin, quizcategory.PostQuizCategory)
	quizCategoryGroup.Patch("/:id", middlewares.Auth, middlewares.IsAdmin, quizcategory.UpdateQuizCategory)
	quizCategoryGroup.Get("/:id", middlewares.Auth, quizcategory.GetQuizCategory)
	quizCategoryGroup.Get("/", middlewares.Auth, quizcategory.GetAllQuizCategories)
	quizCategoryGroup.Delete("/:id", middlewares.Auth, middlewares.IsAdmin, quizcategory.DeleteQuizCategory)
	quizCategoryGroup.Patch("/:id/attachment/:attachmentID", middlewares.Auth, middlewares.IsAdmin, quizcategory.UpdateQuizCategoryAttachment)

	// Quiz
	quizGroup := app.Group("/api/v1/quiz", func(c *fiber.Ctx) error {
		return c.Next()
	})
	quizGroup.Post("/", middlewares.Auth, middlewares.IsAdmin, quiz.PostQuiz)
	quizGroup.Post("/:id/duplicate", middlewares.Auth, middlewares.IsAdmin, quiz.DuplicateQuiz)
	quizGroup.Patch("/:id", middlewares.Auth, middlewares.IsAdmin, quiz.UpdateQuiz)
	quizGroup.Get("/search", middlewares.Auth, quiz.SearchQuiz)
	quizGroup.Get("/:id", middlewares.Auth, quiz.GetQuiz)
	quizGroup.Get("/", middlewares.Auth, quiz.GetAllQuizzes)
	quizGroup.Delete("/:id", middlewares.Auth, middlewares.IsAdmin, quiz.DeleteQuiz)
	quizGroup.Patch("/:id/attachment/:attachmentID", middlewares.Auth, middlewares.IsAdmin, quiz.UpdateQuizAttachment)
	quizGroup.Patch("/:id/attemptable", middlewares.Auth, middlewares.IsAdmin, quiz.MakeQuizAttemptable)
	quizGroup.Patch("/:id/unattemptable", middlewares.Auth, middlewares.IsAdmin, quiz.MakeQuizUnAttemptable)
	quizGroup.Patch("/:id/show", middlewares.Auth, middlewares.IsAdmin, quiz.ShowQuiz)
	quizGroup.Patch("/:id/hide", middlewares.Auth, middlewares.IsAdmin, quiz.HideQuiz)
	quizGroup.Get("/", middlewares.Auth, quiz.GetAllQuizzes)
	// quizGroup.Get("/data-for-attempt/:id", middlewares.Auth, quiz.GetQuizDataForAttempt)
	quizGroup.Get("/attempt/:id", middlewares.Auth, quiz.GetQuizDataForAttempt)
	quizGroup.Get("/attempted-data/:id", middlewares.Auth, quiz.GetQuizAttemptedData)
	quizGroup.Get("/analytics/summary", middlewares.Auth, middlewares.IsAdmin, quiz.GetQuizAnalytics)

	// Question
	questionGroup := app.Group("/api/v1/question", func(c *fiber.Ctx) error {
		return c.Next()
	})
	questionGroup.Post("/", middlewares.Auth, middlewares.IsAdmin, question.PostQuestion)
	questionGroup.Get("/search", middlewares.Auth, question.SearchQuestion)
	questionGroup.Get("/next-sequence", middlewares.Auth, middlewares.IsAdmin, question.GetNextQuestionSequenceNumber)
	questionGroup.Patch("/:id", middlewares.Auth, middlewares.IsAdmin, question.UpdateQuestion)
	questionGroup.Get("/:id", middlewares.Auth, question.GetQuestion)
	questionGroup.Delete("/:id", middlewares.Auth, middlewares.IsAdmin, question.DeleteQuestion)
	questionGroup.Get("/quiz/:quizID", middlewares.Auth, question.GetAllQuestionsByQuiz)
	questionGroup.Patch("/:id/attachment/:attachmentID", middlewares.Auth, middlewares.IsAdmin, question.UpdateQuestionAttachment)

	// Answer
	answerGroup := app.Group("/api/v1/answer", func(c *fiber.Ctx) error {
		return c.Next()
	})
	answerGroup.Post("/", middlewares.Auth, middlewares.IsAdmin, answer.PostAnswer)
	answerGroup.Get("/next-sequence", middlewares.Auth, middlewares.IsAdmin, answer.GetNextAnswerSequenceNumber)
	answerGroup.Patch("/:id", middlewares.Auth, middlewares.IsAdmin, answer.UpdateAnswer)
	answerGroup.Get("/:id", middlewares.Auth, answer.GetAnswer)
	answerGroup.Delete("/:id", middlewares.Auth, middlewares.IsAdmin, answer.DeleteAnswer)
	answerGroup.Get("/question/:questionID", middlewares.Auth, answer.GetAllAnswersByQuestion)
	answerGroup.Patch("/:id/attachment/:attachmentID", middlewares.Auth, middlewares.IsAdmin, answer.UpdateAnswerAttachment)

	// Attempt
	attemptGroup := app.Group("/api/v1/attempt", func(c *fiber.Ctx) error {
		return c.Next()
	})
	attemptGroup.Post("/", middlewares.Auth, attempt.PostAttempt)

	// AttemptDuration
	attemptDurationGroup := app.Group("/api/v1/attemptduration", func(c *fiber.Ctx) error {
		return c.Next()
	})
	attemptDurationGroup.Patch("/quiz/:quizID", middlewares.Auth, attemptduration.UpdateAttemptDuration)
	attemptDurationGroup.Get("/quiz/:quizID", middlewares.Auth, attemptduration.GetAttemptDuration)

	// SiteVisit
	siteVisitGroup := app.Group("/api/v1/sitevisit", func(c *fiber.Ctx) error {
		return c.Next()
	})
	siteVisitGroup.Post("/", middlewares.SetUserInRequest, sitevisit.PostSiteVisit)

	// Analytics
	analyticsGroup := app.Group("/api/v1/analytics", func(c *fiber.Ctx) error {
		return c.Next()
	})
	analyticsGroup.Get("/admin", middlewares.Auth, middlewares.IsAdmin, analytics.GetAdminAnalytics)
	analyticsGroup.Get("/user", middlewares.Auth, analytics.GetUserAnalytics)

	// Metrics
	app.Get("/metrics", monitor.GetMetrics)

	// Status
	app.Get("/status", status.GetAppStatus)

	// Health
	app.Get("/health", health.CheckHealth)

	app.Use("*", func(c *fiber.Ctx) error {
		message := fmt.Sprintf("api route '%s' doesn't exist!", c.Path())
		return fiber.NewError(fiber.StatusNotFound, message)
	})

	// Initialize event subscribers
	subscribers.InitEventSubscribers()

	log.Fatal(app.Listen("0.0.0.0:5000"))
}
