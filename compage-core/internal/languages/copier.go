package languages

import (
	"fmt"
	"os"
)

func CopyRootLevelFiles(src, dest string) error {
	openedFile, err := os.Open(src)
	if err != nil {
		return err
	}

	if fileInfo, err0 := openedFile.Stat(); err0 != nil {
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
