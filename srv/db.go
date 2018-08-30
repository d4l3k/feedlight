package main

import (
	"encoding/json"
	"time"

	"github.com/d4l3k/feedlight/srv/feedlightpb"
	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

var db *gorm.DB

type Domain struct {
	ID string `gorm:"primary_key"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

type Feedback struct {
	feedlightpb.Feedback `gorm:"embedded"`
	Email                string `gorm:"not null"`
	Domain               string `gorm:"index,not null"`

	Embedding       []byte
	embeddingLoaded []float32

	To            []FeedbackLink `gorm:"foreignkey:FromID"`
	From          []FeedbackLink `gorm:"foreignkey:ToID"`
	NumSimilar    int64
	NumDissimilar int64
}

// GetEmbedding loads the Embedding and caches it.
func (f *Feedback) GetEmbedding() ([]float32, error) {
	if f.embeddingLoaded == nil {
		if err := json.Unmarshal(f.Embedding, &f.embeddingLoaded); err != nil {
			return nil, err
		}
	}

	return f.embeddingLoaded, nil
}

type FeedbackLink struct {
	ID           int64
	FromID, ToID int64  `gorm:"not null"`
	Email        string `gorm:"not null"`
	Similar      bool   `gorm:"not null"`
}

func setupDB() error {
	var err error
	db, err = gorm.Open("postgres", *dbAddr)
	if err != nil {
		return err
	}
	db.SetLogger(gorm.Logger{LogWriter: logWriter{SugaredLogger: log}})

	models := []interface{}{
		new(Feedback),
		new(FeedbackLink),
		new(Domain),
	}
	if err := db.AutoMigrate(models...).Error; err != nil {
		return errors.Wrapf(err, "migrating %+v", models)
	}

	return nil
}
