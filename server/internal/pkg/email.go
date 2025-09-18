package pkg

import (
	"bytes"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/mailjet/mailjet-apiv3-go/v4"
)

type Email struct {
	Recipient string
}

// sends email to mails of all categories using mailjet wrapper
func (e *Email) sendMailHTML(html, subject string) error {
	publicKey := os.Getenv("MJ_APIKEY_PUBLIC")
	secretKey := os.Getenv("MJ_APIKEY_PRIVATE")
	senderMail := os.Getenv("MJ_SENDER_MAIL")

	mailjetClient := mailjet.NewMailjetClient(publicKey, secretKey)
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: senderMail,
				Name:  "BiTE",
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: e.Recipient,
					Name:  "User x",
				},
			},
			Subject:  subject,
			TextPart: "",
			HTMLPart: html,
		},
	}
	messages := mailjet.MessagesV31{Info: messagesInfo}

	results, err := mailjetClient.SendMailV31(&messages)
	if err != nil {
		return err
	}
	log.Printf("MailJet results %+v :", results)
	log.Println("mail sent!")

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
