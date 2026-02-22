package types

type Pagination struct {
	Limit        int64  `json:"limit"`
	NextCursor   string `json:"nextCursor"`
	HasNextItems bool   `json:"hasNextItems"`
	Count        int64  `json:"count"`
}
