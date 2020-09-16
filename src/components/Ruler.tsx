import React, { useState, useContext, useEffect, useRef } from 'react'
import { useMemo } from 'react'
import { RulerContext, RulerActions, IEpubRuler } from '../index'
import { drawRuler, clearCanvas, getScaleValue } from '../utils/utils'
// ------------------------------------------------ inter
interface IRuler {
  vertical: boolean
}
interface IRulerState {
  scale: number
  ratio: number
  vertical: boolean
  breadth: number
  start: number
  length: number
  selectStart: number
  selectLength: number
  rulerStyle: {
    bgColor: string
    scaleSmallColor: string
    scaleLargeColor: string
    scaleFontColor: string
    shadowColor: string
  }
}

// ------------------------------------------------ util
// TODO: optimize interface, remove default return value
const calcRulerState = (context: IEpubRuler, vertical: boolean): IRulerState => {
  const { rulerValue: rulerValue, listenDOM: domGroup, breadth: breadth, scale: scale } = context
  const rulerStyle = context.style.rulerStyle

  const defaultValue = {
    scale: 0,
    ratio: 0,
    vertical: true,
    breadth: 0,
    start: 0,
    length: 0,
    selectStart: 0,
    selectLength: 0,
    rulerStyle: {
      bgColor: 'rgba(225,225,225, 0)', // ruler bg color
      scaleLargeColor: '#BABBBC', // ruler longer mark color
      scaleSmallColor: '#C8CDD0', // ruler shorter mark color
      scaleFontColor: '#7D8694', // ruler font color
      shadowColor: '#E8E8E8' // ruler shadow color
    }
  }

  if (domGroup && domGroup.screen) {
    const getRectByClassName = (classType: 'screen' | 'editor' | 'select') => {
      return document.querySelector(`.${domGroup[classType]}`)?.getBoundingClientRect()
    }
    const screenRect = getRectByClassName('screen')
    const editorRect = getRectByClassName('editor')
    const selectRect = getRectByClassName('select')

    if (screenRect && editorRect && selectRect) {
      return {
        vertical: vertical,
        ratio: context.ratio,
        scale: context.scale,
        breadth: context.breadth,
        start: vertical
          ? (screenRect.top + breadth - editorRect.top) / scale
          : (screenRect.left + breadth - editorRect.left) / scale,
        length: vertical ? screenRect.height - breadth : screenRect.width - breadth,
        selectStart: vertical
          ? (screenRect.top + breadth - selectRect.top) / scale
          : (screenRect.left + breadth - selectRect.left) / scale,
        selectLength: vertical ? selectRect.height : selectRect.width,
        rulerStyle: rulerStyle
      }
    }
    return defaultValue
  } else if (rulerValue) {
    return {
      vertical: vertical,
      ratio: context.ratio,
      scale: context.scale,
      breadth: context.breadth,
      start: vertical ? -(rulerValue.startY / scale) : -(rulerValue.startX / scale),
      length: vertical ? rulerValue.height - breadth : rulerValue.width - breadth,
      selectStart: vertical ? -rulerValue.selectY : -rulerValue.selectX,
      selectLength: vertical ? rulerValue.selectHeight : rulerValue.selectWidth,
      rulerStyle: rulerStyle
    }
  } else {
    return defaultValue
  }
}

// ------------------------------------------------ comp
export const Ruler: React.FC<IRuler> = (props) => {
  const { vertical } = props
  const { dispatch } = useContext(RulerActions)
  const context = useContext<IEpubRuler>(RulerContext)
  const canRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  const [rulerState, setRulerState] = useState<IRulerState>(calcRulerState(context, vertical))

  useEffect(() => {
    setRulerState(calcRulerState(context, vertical))
  }, [context, vertical, canRef])

  useEffect(() => {
    const ctx = canRef.current?.getContext('2d')
    if (ctx !== null && rulerState.scale !== 0) {
      drawRuler({ ...rulerState, ctx })
      dispatch({ type: 'setStart', payload: { startValue: rulerState.start, vertical: vertical } })
      dispatch({ type: 'setWidthAndHeight', payload: { length: rulerState.length, vertical: vertical } })
    }
    return () => {
      const ctx = canRef.current?.getContext('2d')
      if (ctx !== null && rulerState.scale !== 0) {
        clearCanvas(rulerState.breadth, rulerState.length, vertical, ctx)
      }
    }
  }, [rulerState, context.rulerRefreshTrigger])

  const handleRulerDown = (e: React.MouseEvent<Element>) => {
    const guideValue = getScaleValue(
      vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX,
      rulerState.start,
      rulerState.scale
    )
    dispatch({ type: 'addGuide', payload: { value: guideValue, vertical: vertical } })
  }

  return useMemo(() => {
    if (rulerState.scale !== 0) {
      // console.log('ruler re-render') // Performance Testing
      return (
        <canvas
          width={vertical ? rulerState.breadth - 1 : rulerState.length}
          height={vertical ? rulerState.length : rulerState.breadth - 1}
          ref={canRef}
          onMouseDown={handleRulerDown}
          // onMouseEnter={mouseEnter}
          // onMouseMove={mouseMove}
          // onMouseLeave={mouseLeave}
          // onMouseDown={mouseDown}
        />
      )
    }
    return null
  }, [rulerState, context.rulerRefreshTrigger])
}
