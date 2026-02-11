package subscribers

import (
	"encoding/json"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

// VerifySatsRewardAddress subscribes to VERIFY_SATS_REWARD_ADDRESS event and verifies user sats reward address
func VerifySatsRewardAddress() {
	go func() {
		satsRewardAddressChan := make(chan events.DataEvent)
		events.EB.Subscribe("VERIFY_SATS_REWARD_ADDRESS", satsRewardAddressChan)

		for {
			satsRewardAddressEvent := <-satsRewardAddressChan
			satsRewardAddressEventData, ok := satsRewardAddressEvent.Data.(types.SatsRewardAddressEventData)
			if !ok {
				log.Printf("Invalid SatsRewardAddressEventData type received: %+v", satsRewardAddressEvent.Data)
				continue
			}

			log.Printf("Processing VERIFY_SATS_REWARD_ADDRESS event for userID: %s", satsRewardAddressEventData.UserID)

			satsRewardAddress := models.SatsRewardAddress{}

			savedSatsRewardAddress, err := satsRewardAddress.FindByAddress(satsRewardAddressEventData.Address)
			if err != nil {
				log.Printf("Error finding sats reward address: %+v", err)
				continue
			}

			if savedSatsRewardAddress.ID != "" && savedSatsRewardAddress.IsVerified {
				log.Printf("Sats reward address already exists and is verified: %s", satsRewardAddressEventData.Address)
				continue
			}

			blinkClient := pkg.NewBlinkClient()

			lnInfo, err := blinkClient.CheckLightningAddressAvailability(satsRewardAddressEventData.Address)
			if err != nil {
				log.Printf("Error checking lightning address availability: %+v", err)
				continue
			}
			log.Printf("Lightning address info: %+v", lnInfo)

			lnInfoJson, err := json.Marshal(&lnInfo)
			if err != nil {
				log.Printf("Error Marshalling lnInfo:%+v\n", err)
				continue
			}

			satsRewardAddress.ID = savedSatsRewardAddress.ID
			satsRewardAddress.Address = satsRewardAddressEventData.Address
			satsRewardAddress.UserID = savedSatsRewardAddress.UserID
			satsRewardAddress.IsDefault = savedSatsRewardAddress.IsDefault
			satsRewardAddress.CreatedAt = savedSatsRewardAddress.CreatedAt
			satsRewardAddress.IsVerified = true
			satsRewardAddress.Info = models.JSONB(lnInfoJson)

			updatedSatsRewardAddress, err := satsRewardAddress.Update()
			if err != nil {
				log.Printf("Error updating sats reward address: %+v", err)
				continue
			}
			log.Printf("Sats reward address validated and updated successfully: %+v", updatedSatsRewardAddress)
		}
	}()
}
