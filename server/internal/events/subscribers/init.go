package subscribers

import (
	"log"
)

// InitEventSubscribers initializes all event subscribers
func InitEventSubscribers() {
	log.Println("Initiating global event subscribers...")

	go PostAttemptStatus()
	go UpdateRanking()

	log.Println("Event subscribers initialized successfully")
}
