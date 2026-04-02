package pkg

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

const (
	defaultWorkers       = 5
	defaultRenderTimeout = 30 * time.Second
)

// Renderer manages a pool of Chrome tabs for HTML-to-PDF and HTML-to-PNG conversion.
type Renderer struct {
	allocCtx      context.Context
	allocCancel   context.CancelFunc
	browserCtx    context.Context
	browserCancel context.CancelFunc
	sem           chan struct{}
	timeout       time.Duration
	once          sync.Once
}

// Options configures the Renderer.
type Options struct {
	// MaxWorkers is the number of concurrent Chrome tabs. Defaults to 5.
	MaxWorkers int
	// RenderTimeout is the max time allowed per render. Defaults to 30s.
	RenderTimeout time.Duration
	// Headless controls whether Chrome runs headlessly. Should be true in production.
	Headless bool
}

// New creates and pre-warms a Renderer. Call Close() when done.
func NewChromedpRenderer(opts Options) (*Renderer, error) {
	if opts.MaxWorkers <= 0 {
		opts.MaxWorkers = defaultWorkers
	}
	if opts.RenderTimeout <= 0 {
		opts.RenderTimeout = defaultRenderTimeout
	}

	env := os.Getenv("GO_ENV")
	if env == "production" {
		opts.Headless = true
	}

	chromeopts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", opts.Headless),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-extensions", true),
		chromedp.Flag("disable-background-networking", true),
	)

	allocCtx, allocCancel := chromedp.NewExecAllocator(context.Background(), chromeopts...)
	browserCtx, browserCancel := chromedp.NewContext(allocCtx)

	r := &Renderer{
		allocCtx:      allocCtx,
		allocCancel:   allocCancel,
		browserCtx:    browserCtx,
		browserCancel: browserCancel,
		sem:           make(chan struct{}, opts.MaxWorkers),
		timeout:       opts.RenderTimeout,
	}

	// Pre-warm: initialize the browser process so the first real request isn't slow.
	if err := chromedp.Run(browserCtx, chromedp.Navigate("about:blank")); err != nil {
		allocCancel()
		browserCancel()
		return nil, fmt.Errorf("renderer: pre-warm failed: %w", err)
	}

	return r, nil
}

// Close shuts down the browser and releases all resources.
// Should be called via defer in main() or on server shutdown.
func (r *Renderer) Close() {
	r.once.Do(func() {
		r.browserCancel()
		r.allocCancel()
	})
}

// HTMLToPDF converts an HTML string to a PDF byte slice.
func (r *Renderer) HTMLToPDF(htmlContent string) ([]byte, error) {
	r.sem <- struct{}{}
	defer func() { <-r.sem }()

	ctx, cancel := context.WithTimeout(r.browserCtx, r.timeout)
	defer cancel()

	tabCtx, tabCancel := chromedp.NewContext(ctx)
	defer tabCancel()

	var pdfBuf []byte
	err := chromedp.Run(tabCtx,
		chromedp.Navigate(encodeHTML(htmlContent)),
		chromedp.WaitReady("body"),
		chromedp.ActionFunc(func(ctx context.Context) error {
			var err error
			pdfBuf, _, err = page.PrintToPDF().
				WithPrintBackground(true).
				WithPreferCSSPageSize(true).
				Do(ctx)
			return err
		}),
	)
	if err != nil {
		return nil, fmt.Errorf("renderer: HTMLToPDF failed: %w", err)
	}

	return pdfBuf, nil
}

// HTMLToPNG converts an HTML string to a full-page PNG byte slice.
func (r *Renderer) HTMLToPNG(htmlContent string) ([]byte, error) {
	r.sem <- struct{}{}
	defer func() { <-r.sem }()

	ctx, cancel := context.WithTimeout(r.browserCtx, r.timeout)
	defer cancel()

	tabCtx, tabCancel := chromedp.NewContext(ctx)
	defer tabCancel()

	var imgBuf []byte
	err := chromedp.Run(tabCtx,
		chromedp.Navigate(encodeHTML(htmlContent)),
		chromedp.WaitReady("body"),
		chromedp.FullScreenshot(&imgBuf, 100),
	)
	if err != nil {
		return nil, fmt.Errorf("renderer: HTMLToPNG failed: %w", err)
	}

	return imgBuf, nil
}

// encodeHTML encodes HTML content as a base64 data URI for reliable Chrome navigation.
// url.QueryEscape mangles CSS characters ({, }, :, ;) which breaks template styles.
func encodeHTML(htmlContent string) string {
	encoded := base64.StdEncoding.EncodeToString([]byte(htmlContent))
	return "data:text/html;base64," + encoded
}
