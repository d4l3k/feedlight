package main

import (
	"github.com/d4l3k/feedlight/srv/feedlightpb"
	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

var db *gorm.DB

type Feedback struct {
	feedlightpb.Feedback `gorm:"embedded"`
	Email                string

	To   []FeedbackLink `gorm:"foreignkey:FromID"`
	From []FeedbackLink `gorm:"foreignkey:ToID"`
}

type FeedbackLink struct {
	ID           int64
	FromID, ToID int64
	Email        string
	Similar      bool
}

func setupDB() error {
	var err error
	db, err = gorm.Open("postgres", "postgres://root@localhost:26257/feedlight?sslmode=disable")
	if err != nil {
		return err
	}
	db.SetLogger(gorm.Logger{LogWriter: logWriter{SugaredLogger: log}})

	models := []interface{}{
		new(Feedback),
		new(FeedbackLink),
	}
	if err := db.AutoMigrate(models...).Error; err != nil {
		return errors.Wrapf(err, "migrating %+v", models)
	}

	return nil
}
