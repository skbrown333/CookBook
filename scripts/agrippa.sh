stylingImports="@import '../../styles/responsive';\n@import '@elastic/eui/src/themes/eui-amsterdam/eui_amsterdam_colors_dark.scss';\n@import '../../styles/general';"
lowerCaseComponent=$(echo $1 | tr -d '-')
scssFileName="_$lowerCaseComponent.scss"
scssFilePath="$2/$scssFileName"
reactImport="import React from 'react';"
scssImport="import './$scssFileName'; "
outputFilePath="$2/output.tsx"

(echo $stylingImports; echo "\n.$lowerCaseComponent {}") >> $scssFilePath
echo "$reactImport\n\n$scssImport" | cat - $3 > $2/output.tsx
mv $outputFilePath $3
