package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (sv *SiteVisit) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (sv *SiteVisit) Create(siteVisit SiteVisit) (SiteVisit, error) {
	if err := db.Create(&siteVisit).Error; err != nil {
		return siteVisit, err
	}
	return siteVisit, nil
}

func (sv *SiteVisit) FindOne(id string) (SiteVisit, error) {
	var siteVisit SiteVisit

	db.First(&siteVisit, "id = ?", id)

	return siteVisit, nil
}

func (sv *SiteVisit) FindAll(limit float64, cursor string) ([]SiteVisit, error) {
	var siteVisits []SiteVisit

	query := db.Model(&SiteVisit{}).
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSiteVisit SiteVisit
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastSiteVisit).Error; err != nil {
			return siteVisits, err
		}
		query = query.Where("\"createdAt\" < ?", lastSiteVisit.CreatedAt)
	}

	query.Find(&siteVisits)

	return siteVisits, nil
}

func (sv *SiteVisit) Update() (SiteVisit, error) {
	db.Save(&sv)

	return *sv, nil
}

func (sv *SiteVisit) Delete(id string) error {

	if err := db.Unscoped().Where("id = ?", id).Delete(&SiteVisit{}).Error; err != nil {
		return err
	}
	return nil
}
