package middlewares

import (
	"fmt"
	"os"
	"strings"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

// SetUserInRequest is mean't to be used after auth middleware
func SetUserInRequest(c *fiber.Ctx) error {
	User := models.User{}

	isLoggedIn, userID, err := isLoggedInUser(c)

	if err != nil {
		user, err := User.FindUnknown()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		c.Locals("userID", user.ID)
		return c.Next()
	}

	if userID == "" {
		user, err := User.FindUnknown()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		c.Locals("userID", user.ID)
		return c.Next()
	}

	if isLoggedIn && userID != "" {
		c.Locals("userID", userID)
		return c.Next()
	}

	return c.Next()
}

// isLoggedInUser returns, isLoggedIn, userID, err
func isLoggedInUser(c *fiber.Ctx) (bool, string, error) {
	authHeader := c.Get("Authorization")
	var bearerToken string
	User := models.User{}

	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer") {
		headerParts := strings.SplitN(authHeader, " ", 2)
		if len(headerParts) > 1 {
			bearerToken = headerParts[1]
		}
	}

	if bearerToken == "" {
		return false, "", fmt.Errorf("no bearer token")
	}

	secretKey := os.Getenv("JWT_SECRET")
	var jwtSecretKey = []byte(secretKey)

	token, err := jwt.Parse(bearerToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecretKey, nil
	})

	if err != nil {
		return false, "", err
	}

	var userID string
	claims, validJWTClaim := token.Claims.(jwt.MapClaims)
	if !validJWTClaim || !token.Valid {
		return false, "", fmt.Errorf("invalid token")
	}

	if userIDClaim, ok := claims["userID"].(string); ok {
		userID = userIDClaim
	}

	user, err := User.FindOne(userID)
	if err != nil {
		return false, "", err
	}

	return true, user.ID, nil
}
