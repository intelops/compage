package languages

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/utils"
	"io"
	"os"
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
	return CopyAllFilesInSrcDirToDestDir(destKubernetesDirectory, srcKubernetesDirectory, true)
}

func (nc NeutralCopier) CreateRootLevelFiles(templatePath string) error {
	return CopyAllFilesInSrcDirToDestDir(nc.NodeDirectoryName, templatePath, false)
}

func CopyAllFilesInSrcDirToDestDir(dest, src string, copyNestedDir bool) error {
	openedDir, err := os.Open(src)
	if err != nil {
		return err
	}

	if fileInfo, err0 := openedDir.Stat(); err0 != nil {
		return err0
	} else if !fileInfo.IsDir() {
		return fmt.Errorf("Source " + fileInfo.Name() + " is not a directory!")
	}

	if err = os.Mkdir(dest, 0755); err != nil && err != os.ErrExist {
		return err
	}

	if files, err1 := os.ReadDir(src); err1 != nil {
		return err1
	} else {
		for _, file := range files {
			if !file.IsDir() {
				content, err2 := os.ReadFile(src + "/" + file.Name())
				if err2 != nil {
					return err2
				}
				err2 = os.WriteFile(dest+"/"+file.Name(), content, 0755)
				if err2 != nil {
					return err2
				}
			}
		}
	}
	return nil
}

func CopyFile(dst, src string) (int64, error) {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return 0, err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return 0, fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer func(source *os.File) {
		_ = source.Close()
	}(source)

	destination, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer func(destination *os.File) {
		_ = destination.Close()
	}(destination)
	return io.Copy(destination, source)
}
