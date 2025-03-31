package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	DBHost         string `mapstructure:"POSTGRES_HOST"`
	DBUsername     string `mapstructure:"POSTGRES_USER"`
	DBPassword     string `mapstructure:"POSTGRES_PASSWORD"`
	DBName         string `mapstructure:"POSTGRES_DB"`
	DBPort         string `mapstructure:"POSTGRES_PORT"`
	MigrationPath  string `mapstructure:"MIGRATION_PATH"`
	DBReset        bool   `mapstructure:"DB_RESET"`
	ServerPort     string `mapstructure:"SERVER_PORT"`
	SessionKey     string `mapstructure:"SESSION_KEY"`
	BucketUrlWrite string `mapstructure:"R2_BUCKET_URL_WRITE"`
	BucketUrlRead  string `mapstructure:"R2_BUCKET_URL_READ"`
	BucketAuthKey  string `mapstructure:"R2_CUSTOM_AUTH_KEY"`
	RedisAddr      string `mapstructure:"REDIS_ADDR"`
	DBUrl          string
}

func LoadConfig(path string) (config Config) {
	viper.SetConfigName(".env") // name of config file (without extension)
	viper.SetConfigType("env")  // REQUIRED if the config file does not have the extension in the name:w
	viper.AddConfigPath(path)   // path to look for the config file in
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading conf file: %v", err)
	}

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatalf("Error binding conf object with data: %v", err)
	}

	config.DBUrl = fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		config.DBUsername,
		config.DBPassword,
		config.DBHost,
		config.DBPort,
		config.DBName)
	log.Printf("db url: %v", config.DBUrl)
	return
}
