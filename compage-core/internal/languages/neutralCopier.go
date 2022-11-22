package languages

import (
	"github.com/kube-tarian/compage-core/internal/utils"
)

const KubernetesPath = "/kubernetes"

type NeutralCopier struct {
	NodeDirectoryName string `json:"nodeDirectoryName"`
}

func (nc NeutralCopier) CreateKubernetesFiles(templatePath string) error {
	srcKubernetesDirectory := templatePath + KubernetesPath
	destKubernetesDirectory := nc.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}
	return utils.CopyFilesAndDirs(destKubernetesDirectory, srcKubernetesDirectory)
}

func (nc NeutralCopier) CreateRootLevelFiles(templatePath string) error {
	return utils.CopyFiles(nc.NodeDirectoryName, templatePath)
}
