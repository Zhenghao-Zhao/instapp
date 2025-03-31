package image

import (
	"bytes"
	"errors"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/google/uuid"
	"github.com/zhenghao-zhao/instapp/config"
)

type ImageHandler struct {
	BucketUrlRead  string
	BucketAuthKey  string
	BucketUrlWrite string
	ImageQuality   int
}

func NewImageHandler(config *config.Config, imageQuality int) *ImageHandler {
	return &ImageHandler{
		BucketUrlWrite: config.BucketUrlWrite,
		BucketUrlRead:  config.BucketUrlRead,
		BucketAuthKey:  config.BucketAuthKey,
		ImageQuality:   imageQuality,
	}
}

var NilUid string = uuid.Nil.String()

func (h *ImageHandler) GetImageUrl(imageUid string) *string {
	if imageUid == NilUid {
		return nil
	}
	url := h.BucketUrlWrite + "/" + imageUid
	return &url
}

func (h *ImageHandler) GetPostImageUrls(imageUids []uuid.UUID) []string {
	result := make([]string, len(imageUids))
	for i, uid := range imageUids {
		result[i] = h.BucketUrlWrite + "/" + uid.String()
	}
	return result
}

func (h *ImageHandler) NewBucketRequest(reqType string, filename string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(reqType, h.BucketUrlWrite+"/"+filename, body)
	req.Header.Add("X-Custom-Auth-Key", h.BucketAuthKey)

	return req, err
}

func (h *ImageHandler) ProcessImageFile(inputFile multipart.File, fileType string) (*bytes.Buffer, error) {
	var decodedImage image.Image
	var err error
	outputBuf := new(bytes.Buffer)
	switch fileType {
	case "image/png":
		decodedImage, err = png.Decode(inputFile)
		if err != nil {
			return nil, err
		}
	case "image/jpeg":
		decodedImage, err = jpeg.Decode(inputFile)
		if err != nil {
			return nil, err
		}
	default:
		return nil, errors.New("incorrect file type")
	}
	err = jpeg.Encode(outputBuf, decodedImage, &jpeg.Options{Quality: h.ImageQuality})
	return outputBuf, err
}
