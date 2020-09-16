# ep-ruler

>  sketch like ruler build by react typescript

[![NPM](https://img.shields.io/npm/v/ep-ruler.svg)](https://www.npmjs.com/package/ep-ruler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ep-ruler
```

## Usage

```tsx

import React, { Component } from 'react'
import { EpubRuler, RulerActionType } from 'ep-ruler'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

```tsx
import React from 'react'
import { EpubRuler, RulerActionType } from 'ep-ruler'


	// TEST: auto mode
  const auto = {
    screen: 'screen',
    editor: 'editor',
    select: 'select'
  }

  // TEST: manual mode
  // const manual = {
  //   width: 700,
  //   height: 300,
  //   startX: 30,
  //   startY: 40,
  //   selectWidth: 82,
  //   selectHeight: 61,
  //   selectX: 55,
  //   selectY: 67
  // }

  // TODO: semi-automatic mode

  // const style = {
  //   layerStyle: {
  //     borderColor: 'black'
  //   },
  //   rulerStyle: {
  //     bgColor: 'rgba(225,225,225, 0.2)', // ruler bg color
  //     scaleLargeColor: 'yellow', // ruler longer mark color
  //     scaleSmallColor: 'blue', // ruler shorter mark color
  //     scaleFontColor: 'red', // ruler font color
  //     shadowColor: 'rgb(185, 200, 253, 0.2)' // ruler shadow color
  //   },
  //   guideStyle: {
  //     color: 'black',
  //     removeColor: '#000000', // TODO
  //     valueColor: 'black',
  //     valueBgColor: 'rgb(235, 86, 72, 0.1)'
  //   }
  // }


<EpubRuler
  listenDOM={auto}
  // rulerValue={manual}
  scale={scale}
  guides={lines}
  actionRef={childRef}
  // style={style}
  updateRuler={updateLines} // TODO
/>
```

`IRulerProps`:

```tsx
	ratio?: number
  scale?: number
  breadth?: number

  guides?: { h: number[]; v: number[] }

  rulerValue?: {
    width: number
    height: number
    startX: number
    startY: number
    selectWidth: number
    selectHeight: number
    selectX: number
    selectY: number
  }

  listenDOM?: {
    screen: string
    editor: string
    select: string
  }

  controls?: {
    showRuler?: boolean
    showGuide?: boolean
    showPseudoLine?: boolean
    showNumber?: boolean
  }

  style?: {
    layerStyle?: {
      borderColor?: string
    }
    rulerStyle?: {
      bgColor?: string
      scaleSmallColor?: string
      scaleLargeColor?: string
      scaleFontColor?: string
      shadowColor?: string
    }
    guideStyle?: {
      color?: string
      removeColor?: string
      valueColor?: string
      valueBgColor?: string
    }
  }

  actionRef?: React.MutableRefObject<RulerActionType | undefined | null> | ((actionRef: RulerActionType) => void)
  updateRuler?: (lines: { h: number[]; v: number[] }) => void
```

`actionRef`:

```tsx
export interface RulerActionType {
  updateRuler: () => void // 触发组件更新
  clearGuides: () => void // TODO
}
```

## License

MIT © [hentai-miao](https://github.com/hentai-miao)
