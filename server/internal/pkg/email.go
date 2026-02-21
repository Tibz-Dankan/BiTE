package pkg

import (
	"bytes"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/resend/resend-go/v3"
)

type Email struct {
	Recipient string
}

// sends email to mails of all categories using resend
func (e *Email) sendMailHTML(html, subject string) error {
	resendApiKey := os.Getenv("RESEND_API_KEY")
	senderMail := os.Getenv("RESEND_SENDER_EMAIL")

	client := resend.NewClient(resendApiKey)

	params := &resend.SendEmailRequest{
		From:    "BiTE <" + senderMail + ">",
		To:      []string{e.Recipient},
		Html:    html,
		Subject: subject,
		// Cc:      []string{"cc@example.com"},
		// Bcc:     []string{"bcc@example.com"},
		ReplyTo: "support@bitcoinhighschool.com",
	}

	sent, err := client.Emails.Send(params)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	log.Println(sent.Id)

	return nil
}

func (u *Email) send(html, subject string) error {
	if err := u.sendMailHTML(html, subject); err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (e *Email) SendResetPassword(name, OTP, subject string) error {
	data := struct {
		Subject string
		Name    string
		OTP     string
		Year    string
	}{
		Subject: subject,
		Name:    name,
		OTP:     OTP,
		Year:    strconv.Itoa(time.Now().Year()),
	}

	var body bytes.Buffer

	templatePath, err := filepath.Abs("./internal/templates/email/reset-password.html")
	if err != nil {
		log.Println("Error finding absolute path:", err)
		return err
	}

	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Println("Error parsing template:", err)
		return err
	}

	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Println("Error executing template:", err)
		return err
	}

	if err := e.send(body.String(), subject); err != nil {
		log.Println("Error sending email:", err)
		return err
	}

	return nil
}

func (e *Email) SendOPT(name, OPT, subject string) error {
	data := struct {
		Subject string
		Name    string
		OPT     string
		Year    string
	}{
		Subject: subject,
		Name:    name,
		OPT:     OPT,
		Year:    strconv.Itoa(time.Now().Year()),
	}

	var body bytes.Buffer

	templatePath, err := filepath.Abs("./internal/templates/email/opt.html")
	if err != nil {
		log.Println("Error finding absolute path:", err)
		return err
	}

	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Println("Error parsing template:", err)
		return err
	}

	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Println("Error executing template:", err)
		return err
	}

	if err := e.send(body.String(), subject); err != nil {
		log.Println("Error sending email:", err)
		return err
	}

	return nil
}

type RewardInfo struct {
	QuizTitle  string
	SatsAmount int64
}

func (e *Email) SendSatsRewardNotification(name string, rewards []RewardInfo, subject string) error {
	data := struct {
		Subject string
		Name    string
		Rewards []RewardInfo
		Year    string
	}{
		Subject: subject,
		Name:    name,
		Rewards: rewards,
		Year:    strconv.Itoa(time.Now().Year()),
	}

	var body bytes.Buffer

	templatePath, err := filepath.Abs("./internal/templates/email/sats-reward-notification.html")
	if err != nil {
		log.Println("Error finding absolute path:", err)
		return err
	}

	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Println("Error parsing template:", err)
		return err
	}

	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Println("Error executing template:", err)
		return err
	}

	if err := e.send(body.String(), subject); err != nil {
		log.Println("Error sending email:", err)
		return err
	}

	return nil
}
