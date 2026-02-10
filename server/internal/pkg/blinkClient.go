package pkg

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/types"
)

type BlinkClient struct {
	apiURL     string
	apiKey     string
	httpClient *http.Client
}

func NewBlinkClient() *BlinkClient {
	apiURL := "https://api.blink.sv/graphql"
	apiKey := os.Getenv("BLINK_API_KEY")

	return &BlinkClient{
		apiURL: apiURL,
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// ExecuteGraphQL makes a GraphQL request to Blink API
func (c *BlinkClient) ExecuteGraphQL(query string, variables map[string]interface{}, result interface{}) error {
	reqBody := types.GraphQLRequest{
		Query:     query,
		Variables: variables,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-KEY", c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	// TODO: To be investigated further
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(body))
	}

	// First unmarshal to check for GraphQL errors
	var graphQLResp types.GraphQLResponse
	graphQLResp.Data = result

	log.Printf("body: %s", string(body))

	if err := json.Unmarshal(body, &graphQLResp); err != nil {
		return fmt.Errorf("failed to unmarshal response: %w", err)
	}

	log.Printf("graphQLResp: %+v", graphQLResp)
	if len(graphQLResp.Errors) > 0 {
		log.Printf("GraphQL error: %v", graphQLResp.Errors)
		return fmt.Errorf("%s", graphQLResp.Errors[0].Message)
	}

	return nil
}

// SendLnAddressPayment sends payment to a Lightning Address
func (c *BlinkClient) SendLnAddressPayment(input types.LnAddressPaymentSendInput) (*types.LnAddressPaymentSendResponse, error) {
	query := `
        mutation LnAddressPaymentSend($input: LnAddressPaymentSendInput!) {
            lnAddressPaymentSend(input: $input) {
                status
                errors {
                    message
                    path
                    code
                }
                transaction {
                    id
                    status
                    direction
                    memo
                    createdAt
                    settlementAmount
                    settlementFee
                    settlementCurrency
                    initiationVia {
                        ... on InitiationViaLn {
                            paymentHash
                        }
                    }
                }
            }
        }
    `

	variables := map[string]interface{}{
		"input": map[string]interface{}{
			"walletId":  input.WalletId,
			"lnAddress": input.LnAddress,
			"amount":    input.Amount,
		},
	}

	var result types.LnAddressPaymentSendResponse
	err := c.ExecuteGraphQL(query, variables, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

// CheckLightningAddressAvailability returns detailed information about the Lightning Address
func (c *BlinkClient) CheckLightningAddressAvailability(lnAddress string) (*types.LightningAddressInfo, error) {
	// Validate it's a Blink address
	if !strings.HasSuffix(strings.ToLower(lnAddress), "@blink.sv") {
		return nil, fmt.Errorf("only Blink Lightning Addresses are supported (@blink.sv)")
	}

	// Extract username
	username := strings.Split(lnAddress, "@")[0]

	log.Printf("Getting details for Lightning Address: %s", lnAddress)

	query := `
		query AccountDefaultWallet($username: Username!, $walletCurrency: WalletCurrency) {
			accountDefaultWallet(username: $username, walletCurrency: $walletCurrency) {
				id
				walletCurrency
			}
		}
	`

	variables := map[string]interface{}{
		"username":       username,
		"walletCurrency": "BTC",
	}

	var result struct {
		AccountDefaultWallet *struct {
			ID             string `json:"id"`
			WalletCurrency string `json:"walletCurrency"`
		} `json:"accountDefaultWallet"`
	}

	err := c.ExecuteGraphQL(query, variables, &result)
	if err != nil {
		log.Printf("Lightning Address validation failed: %v", err)
		return nil, err
	}

	if result.AccountDefaultWallet == nil {
		return &types.LightningAddressInfo{
			LightningAddress: lnAddress,
			Username:         username,
		}, nil
	}

	return &types.LightningAddressInfo{
		LightningAddress: lnAddress,
		Username:         username,
		WalletID:         result.AccountDefaultWallet.ID,
		WalletCurrency:   result.AccountDefaultWallet.WalletCurrency,
	}, nil
}

// ValidateLightningAddressViaLNURL validates Lightning Address using LNURL protocol
// This works for ANY Lightning Address provider (Blink, Alby, Strike, etc.)
func (c *BlinkClient) ValidateLightningAddressViaLNURL(lnAddress string) (*types.LNURLPayInfo, error) {
	// Parse Lightning Address
	parts := strings.Split(lnAddress, "@")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid Lightning Address format")
	}

	username := parts[0]
	domain := parts[1]

	// Construct LNURL-pay well-known URL
	// Standard: https://domain/.well-known/lnurlp/username
	lnurlURL := fmt.Sprintf("https://%s/.well-known/lnurlp/%s", domain, username)

	log.Printf("Validating Lightning Address via LNURL: %s", lnurlURL)

	// Make HTTP request
	resp, err := http.Get(lnurlURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch LNURL data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Lightning Address not found (status: %d)", resp.StatusCode)
	}

	// Parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var lnurlData types.LNURLPayResponse
	if err := json.Unmarshal(body, &lnurlData); err != nil {
		return nil, fmt.Errorf("failed to parse LNURL response: %w", err)
	}

	// Validate response
	if lnurlData.Tag != "payRequest" {
		return nil, fmt.Errorf("invalid LNURL response: expected payRequest tag")
	}

	return &types.LNURLPayInfo{
		LightningAddress: lnAddress,
		Username:         username,
		Domain:           domain,
		MinSendable:      lnurlData.MinSendable,
		MaxSendable:      lnurlData.MaxSendable,
		Metadata:         lnurlData.Metadata,
		Callback:         lnurlData.Callback,
	}, nil
}
