package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (a *Attachment) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (a *Attachment) Create(attachment Attachment) (Attachment, error) {
	if err := db.Create(&attachment).Error; err != nil {
		return attachment, err
	}

	return attachment, nil
}

func (a *Attachment) FindOne(id string) (Attachment, error) {
	var Attachment Attachment

	db.First(&Attachment, "id = ?", id)

	return Attachment, nil
}

func (a *Attachment) FindAllByUser(userID string, limit float64, cursor string) ([]Attachment, error) {
	var Attachments []Attachment

	query := db.Model(&Attachment{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastAttachment Attachment
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastAttachment).Error; err != nil {
			return Attachments, err
		}
		query = query.Where("\"createdAt\" < ?", lastAttachment.CreatedAt)
	}

	query.Where("\"userID\" = ?", userID).Find(&Attachments)

	return Attachments, nil
}

func (a *Attachment) FindAllByQuiz(quizID string, limit float64, cursor string) ([]Attachment, error) {
	var Attachments []Attachment

	query := db.Model(&Attachment{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastAttachment Attachment
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastAttachment).Error; err != nil {
			return Attachments, err
		}
		query = query.Where("\"createdAt\" < ?", lastAttachment.CreatedAt)
	}

	query.Where("\"quizID\" = ?", quizID).Find(&Attachments)

	return Attachments, nil
}

func (a *Attachment) FindAllByQuestion(questionID string, limit float64, cursor string) ([]Attachment, error) {
	var Attachments []Attachment

	query := db.Model(&Attachment{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastAttachment Attachment
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastAttachment).Error; err != nil {
			return Attachments, err
		}
		query = query.Where("\"createdAt\" < ?", lastAttachment.CreatedAt)
	}

	query.Where("\"questionID\" = ?", questionID).Find(&Attachments)

	return Attachments, nil
}

func (a *Attachment) FindAllByAnswer(answerID string, limit float64, cursor string) ([]Attachment, error) {
	var Attachments []Attachment

	query := db.Model(&Attachment{}).
		Preload("Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastAttachment Attachment
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastAttachment).Error; err != nil {
			return Attachments, err
		}
		query = query.Where("\"createdAt\" < ?", lastAttachment.CreatedAt)
	}

	query.Where("\"answerID\" = ?", answerID).Find(&Attachments)

	return Attachments, nil
}

func (a *Attachment) Update() (Attachment, error) {
	if err := db.Save(&a).Error; err != nil {
		return Attachment{}, err
	}

	return *a, nil
}

func (a *Attachment) UpdateFileDetails(attachment Attachment) (Attachment, error) {

	if err := db.Model(&Attachment{}).
		Where("id = ?", attachment.ID).
		Updates(map[string]interface{}{
			"type":        attachment.Type,
			"url":         attachment.Url,
			"filename":    attachment.Filename,
			"size":        attachment.Size,
			"contentType": attachment.ContentType,
		}).Error; err != nil {
		return attachment, err
	}

	attachment, err := a.FindOne(attachment.ID)
	if err != nil {
		return attachment, err
	}

	return attachment, nil
}

func (a *Attachment) Delete(id string) error {
	if err := db.Unscoped().Where("id = ?", id).Delete(&Attachment{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *Attachment) DeleteByUser(userID string) error {
	if err := db.Unscoped().Where("\"userID\" = ?",
		userID).Delete(&Attachment{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *Attachment) DeleteByQuiz(quizID string) error {
	if err := db.Unscoped().Where("\"quizID\" = ?",
		quizID).Delete(&Attachment{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *Attachment) DeleteByQuestion(questionID string) error {
	if err := db.Unscoped().Where("\"questionID\" = ?",
		questionID).Delete(&Attachment{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *Attachment) DeleteByAnswer(answerID string) error {
	if err := db.Unscoped().Where("\"answerID\" = ?",
		answerID).Delete(&Attachment{}).Error; err != nil {
		return err
	}
	return nil
}
