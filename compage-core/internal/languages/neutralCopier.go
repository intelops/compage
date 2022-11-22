package languages

import (
	"github.com/kube-tarian/compage-core/internal/utils"
)

const KubernetesPath = "/kubernetes"

// NeutralCopier LanguageNeutral copier which copies files and directories not specific languages.
type NeutralCopier struct {
	NodeDirectoryName string `json:"nodeDirectoryName"`
}

// CreateKubernetesFiles creates required directory and copies files from language template.
func (nc NeutralCopier) CreateKubernetesFiles(templatePath string) error {
	srcKubernetesDirectory := templatePath + KubernetesPath
	destKubernetesDirectory := nc.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}
	return utils.CopyFilesAndDirs(destKubernetesDirectory, srcKubernetesDirectory)
}

// CreateRootLevelFiles copies all root level files at language template.
func (nc NeutralCopier) CreateRootLevelFiles(templatePath string) error {
	return utils.CopyFiles(nc.NodeDirectoryName, templatePath)
}
