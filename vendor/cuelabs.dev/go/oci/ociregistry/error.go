// Copyright 2023 CUE Labs AG
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package ociregistry

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"unicode"
)

// WireErrors is the JSON format used for error responses in
// the OCI HTTP API. It should always contain at least one
// error.
type WireErrors struct {
	Errors []WireError `json:"errors"`
}

// Unwrap allows [errors.Is] and [errors.As] to
// see the errors inside e.
func (e *WireErrors) Unwrap() []error {
	// TODO we could do this only once.
	errs := make([]error, len(e.Errors))
	for i := range e.Errors {
		errs[i] = &e.Errors[i]
	}
	return errs
}

func (e *WireErrors) Error() string {
	var buf strings.Builder
	buf.WriteString(e.Errors[0].Error())
	for i := range e.Errors[1:] {
		buf.WriteString("; ")
		buf.WriteString(e.Errors[i+1].Error())
	}
	return buf.String()
}

// WireError holds a single error in an OCI HTTP response.
type WireError struct {
	Code_   string `json:"code"`
	Message string `json:"message,omitempty"`
	// Detail_ holds the JSON detail for the message.
	// It's assumed to be valid JSON if non-empty.
	Detail_ json.RawMessage `json:"detail,omitempty"`
}

// Is makes it possible for users to write `if errors.Is(err, ociregistry.ErrBlobUnknown)`
// even when the error hasn't exactly wrapped that error.
func (e *WireError) Is(err error) bool {
	var rerr Error
	return errors.As(err, &rerr) && rerr.Code() == e.Code()
}

// Error implements the [error] interface.
func (e *WireError) Error() string {
	var buf strings.Builder
	for _, r := range e.Code_ {
		if r == '_' {
			buf.WriteByte(' ')
		} else {
			buf.WriteRune(unicode.ToLower(r))
		}
	}
	if buf.Len() == 0 {
		buf.WriteString("(no code)")
	}
	if e.Message != "" {
		buf.WriteString(": ")
		buf.WriteString(e.Message)
	}
	if len(e.Detail_) != 0 && !bytes.Equal(e.Detail_, []byte("null")) {
		buf.WriteString("; detail: ")
		buf.Write(e.Detail_)
	}
	return buf.String()
}

// Code implements [Error.Code].
func (e *WireError) Code() string {
	return e.Code_
}

// Detail implements [Error.Detail].
func (e *WireError) Detail() json.RawMessage {
	return e.Detail_
}

// NewError returns a new error with the given code, message and detail.
func NewError(msg string, code string, detail json.RawMessage) Error {
	return &WireError{
		Code_:   code,
		Message: msg,
		Detail_: detail,
	}
}

// Error represents an OCI registry error. The set of codes is defined
// in the [distribution specification].
//
// [distribution specification]: https://github.com/opencontainers/distribution-spec/blob/main/spec.md#error-codes
type Error interface {
	// error.Error provides the error message.
	error

	// Code returns the error code.
	Code() string

	// Detail returns any detail  associated with the error,
	// or nil if there is none.
	// The caller should not mutate the returned slice.
	Detail() json.RawMessage
}

// HTTPError is optionally implemented by an error when
// the error has originated from an HTTP request
// or might be returned from one.
type HTTPError interface {
	error

	// StatusCode returns the HTTP status code of the response.
	StatusCode() int

	// Response holds the HTTP response that caused the HTTPError to
	// be created. It will return nil if the error was not created
	// as a result of an HTTP response.
	//
	// The caller should not read the response body or otherwise
	// change the response (mutation of errors is a Bad Thing).
	//
	// Use the ResponseBody method to obtain the body of the
	// response if needed.
	Response() *http.Response

	// ResponseBody returns the contents of the response body. It
	// will return nil if the error was not created as a result of
	// an HTTP response.
	//
	// The caller should not change or append to the returned data.
	ResponseBody() []byte
}

// NewHTTPError returns an error that wraps err to make an [HTTPError]
// that represents the given status code, response and response body.
// Both response and body may be nil.
//
// A shallow copy is made of the response.
func NewHTTPError(err error, statusCode int, response *http.Response, body []byte) HTTPError {
	herr := &httpError{
		underlying: err,
		statusCode: statusCode,
	}
	if response != nil {
		herr.response = ref(*response)
		herr.response.Body = nil
		herr.body = body
	}
	return herr
}

type httpError struct {
	underlying error
	statusCode int
	response   *http.Response
	body       []byte
}

// Unwrap implements the [errors] Unwrap interface.
func (e *httpError) Unwrap() error {
	return e.underlying
}

// Is makes it possible for users to write `if errors.Is(err, ociregistry.ErrRangeInvalid)`
// even when the error hasn't exactly wrapped that error.
func (e *httpError) Is(err error) bool {
	switch e.statusCode {
	case http.StatusRequestedRangeNotSatisfiable:
		return err == ErrRangeInvalid
	}
	return false
}

// Error implements [error.Error].
func (e *httpError) Error() string {
	var buf strings.Builder
	buf.WriteString(strconv.Itoa(e.statusCode))
	buf.WriteString(" ")
	buf.WriteString(http.StatusText(e.statusCode))
	if e.underlying != nil {
		buf.WriteString(": ")
		buf.WriteString(e.underlying.Error())
	}
	// TODO if underlying is nil, include some portion of e.body in the message?
	return buf.String()
}

// StatusCode implements [HTTPError.StatusCode].
func (e *httpError) StatusCode() int {
	return e.statusCode
}

// Response implements [HTTPError.Response].
func (e *httpError) Response() *http.Response {
	return e.response
}

// ResponseBody implements [HTTPError.ResponseBody].
func (e *httpError) ResponseBody() []byte {
	return e.body
}

// The following values represent the known error codes.
var (
	ErrBlobUnknown         = NewError("blob unknown to registry", "BLOB_UNKNOWN", nil)
	ErrBlobUploadInvalid   = NewError("blob upload invalid", "BLOB_UPLOAD_INVALID", nil)
	ErrBlobUploadUnknown   = NewError("blob upload unknown to registry", "BLOB_UPLOAD_UNKNOWN", nil)
	ErrDigestInvalid       = NewError("provided digest did not match uploaded content", "DIGEST_INVALID", nil)
	ErrManifestBlobUnknown = NewError("manifest references a manifest or blob unknown to registry", "MANIFEST_BLOB_UNKNOWN", nil)
	ErrManifestInvalid     = NewError("manifest invalid", "MANIFEST_INVALID", nil)
	ErrManifestUnknown     = NewError("manifest unknown to registry", "MANIFEST_UNKNOWN", nil)
	ErrNameInvalid         = NewError("invalid repository name", "NAME_INVALID", nil)
	ErrNameUnknown         = NewError("repository name not known to registry", "NAME_UNKNOWN", nil)
	ErrSizeInvalid         = NewError("provided length did not match content length", "SIZE_INVALID", nil)
	ErrUnauthorized        = NewError("authentication required", "UNAUTHORIZED", nil)
	ErrDenied              = NewError("requested access to the resource is denied", "DENIED", nil)
	ErrUnsupported         = NewError("the operation is unsupported", "UNSUPPORTED", nil)
	ErrTooManyRequests     = NewError("too many requests", "TOOMANYREQUESTS", nil)

	// ErrRangeInvalid allows Interface implementations to reject invalid ranges,
	// such as a chunked upload PATCH not following the range from a previous PATCH.
	// ociserver relies on this error to return 416 HTTP status codes.
	//
	// It is separate from the Error type since the spec only dictates its HTTP status code,
	// but does not assign any error code to it.
	// We borrowed RANGE_INVALID from the Docker registry implementation, a de facto standard.
	ErrRangeInvalid = NewError("invalid content range", "RANGE_INVALID", nil)
)

func ref[T any](x T) *T {
	return &x
}
