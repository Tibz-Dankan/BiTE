package types

// GraphQL Request/Response structures
type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

type GraphQLResponse struct {
	Data   interface{}    `json:"data"`
	Errors []GraphQLError `json:"errors,omitempty"`
}

type GraphQLError struct {
	Message string   `json:"message"`
	Path    []string `json:"path,omitempty"`
	Code    string   `json:"code,omitempty"`
}

// LnAddressPaymentSend structures
type LnAddressPaymentSendInput struct {
	WalletId  string `json:"walletId" validate:"required"`
	LnAddress string `json:"lnAddress" validate:"required,email"`
	Amount    int64  `json:"amount" validate:"required,gt=0"`
}

type LnAddressPaymentSendResponse struct {
	LnAddressPaymentSend struct {
		Status      string             `json:"status"`
		Errors      []GraphQLError     `json:"errors"`
		Transaction *TransactionDetail `json:"transaction"`
	} `json:"lnAddressPaymentSend"`
}

type TransactionDetail struct {
	ID                 string `json:"id"`
	Status             string `json:"status"`
	Direction          string `json:"direction"`
	Memo               string `json:"memo"`
	CreatedAt          int64  `json:"createdAt"`
	SettlementAmount   int64  `json:"settlementAmount"`
	SettlementFee      int64  `json:"settlementFee"`
	SettlementCurrency string `json:"settlementCurrency"`
	InitiationVia      struct {
		PaymentHash string `json:"paymentHash,omitempty"`
	} `json:"initiationVia"`
}

// UsernameAvailable structures
type UsernameAvailableInput struct {
	Username string `json:"username" validate:"required"`
}

type UsernameAvailableResponse struct {
	UsernameAvailable bool `json:"usernameAvailable"`
}

// API Response wrapper
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// LightningAddressInfo contains validation details
type LightningAddressInfo struct {
	LightningAddress string `json:"lightningAddress"`
	Username         string `json:"username"`
	WalletID         string `json:"walletId,omitempty"`
	WalletCurrency   string `json:"walletCurrency,omitempty"`
}

// LNURLPayResponse represents LNURL-pay endpoint response
type LNURLPayResponse struct {
	Tag         string `json:"tag"`
	Callback    string `json:"callback"`
	MinSendable int64  `json:"minSendable"` // millisatoshis
	MaxSendable int64  `json:"maxSendable"` // millisatoshis
	Metadata    string `json:"metadata"`
	CommentSize int    `json:"commentAllowed,omitempty"`
}

// LNURLPayInfo contains Lightning Address validation details
type LNURLPayInfo struct {
	LightningAddress string `json:"lightningAddress"`
	Username         string `json:"username"`
	Domain           string `json:"domain"`
	MinSendable      int64  `json:"minSendable,omitempty"` // in millisatoshis
	MaxSendable      int64  `json:"maxSendable,omitempty"` // in millisatoshis
	Metadata         string `json:"metadata,omitempty"`
	Callback         string `json:"callback,omitempty"`
}
