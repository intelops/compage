{{/*
Expand the name of the chart.
*/}}
{{- define "compage.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "compage.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app(ui) name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "compage.ui.fullname" -}}
{{- if .Values.ui.fullnameOverride }}
{{- .Values.ui.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.ui.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create a default fully qualified app(app) name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "compage.app.fullname" -}}
{{- if .Values.app.fullnameOverride }}
{{- .Values.app.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.app.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create a default fully qualified app(core) name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "compage.core.fullname" -}}
{{- if .Values.core.fullnameOverride }}
{{- .Values.core.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.core.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
ui Common labels
*/}}
{{- define "compage.ui.labels" -}}
helm.sh/chart: {{ include "compage.chart" . }}
{{ include "compage.ui.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
core Common labels
*/}}
{{- define "compage.core.labels" -}}
helm.sh/chart: {{ include "compage.chart" . }}
{{ include "compage.core.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
app Common labels
*/}}
{{- define "compage.app.labels" -}}
helm.sh/chart: {{ include "compage.chart" . }}
{{ include "compage.app.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
ui Selector labels
*/}}
{{- define "compage.ui.selectorLabels" -}}
app.kubernetes.io/name: {{ include "compage.name" . }}-ui
app.kubernetes.io/instance: {{ .Release.Name }}-ui
{{- end }}

{{/*
core Selector labels
*/}}
{{- define "compage.core.selectorLabels" -}}
app.kubernetes.io/name: {{ include "compage.name" . }}-core
app.kubernetes.io/instance: {{ .Release.Name }}-core
{{- end }}

{{/*
app Selector labels
*/}}
{{- define "compage.app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "compage.name" . }}-app
app.kubernetes.io/instance: {{ .Release.Name }}-app
{{- end }}

{{/*
Create the name of the ui service account to use
*/}}
{{- define "compage.ui.serviceAccountName" -}}
{{- if .Values.ui.serviceAccount.create }}
{{- default (include "compage.ui.fullname" .) .Values.ui.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.ui.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the core service account to use
*/}}
{{- define "compage.core.serviceAccountName" -}}
{{- if .Values.core.serviceAccount.create }}
{{- default (include "compage.core.fullname" .) .Values.core.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.core.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the app service account to use
*/}}
{{- define "compage.app.serviceAccountName" -}}
{{- if .Values.app.serviceAccount.create }}
{{- default (include "compage.app.fullname" .) .Values.app.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.app.serviceAccount.name }}
{{- end }}
{{- end }}
