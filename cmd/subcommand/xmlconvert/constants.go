package xmlconvert

// xmlFile is the default path to the XML configuration file.
var xmlFile = "config.xml"

// outputFiles is the default list of output file paths.
var outputFiles = []string{
	"config.yaml",
	"config.json",
}

var exampleCommand = `
# Convert XML file to JSON and YAML with the file path provided in the command line
compage xmlconvert --xmlFile config.xml

# Convert XML file to JSON and YAML with the provided output files with path name specified
compage xmlconvert --xmlFile config.xml --outputFiles filename.yaml,filename.json
`
