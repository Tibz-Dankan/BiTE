package types

// pagination := map[string]interface{}{
// 	"limit":        limit,
// 	"nextCursor":   nextCursor,
// 	"hasNextItems": hasNextItems,
// 	"count":        len(allQuiz),
// }

type Pagination struct {
	Limit        int64  `json:"limit"`
	NextCursor   string `json:"nextCursor"`
	HasNextItems bool   `json:"hasNextItems"`
	Count        int64  `json:"count"`
}
