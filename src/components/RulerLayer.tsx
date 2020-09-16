import React, { useState, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { RulerContext, IEpubRuler } from '../index'
import { Ruler } from './Ruler'
import { Guide } from './Guide'
import { PseudoLine } from './PseudoLine'

// ------------------------------------------------ inter
interface IRulerLayer {
  vertical: boolean
}

// ------------------------------------------------ style
const WrapperRulerLayer = styled.div`
  position: absolute;
  box-sizing: border-box;
  pointer-events: auto;
  user-select: none;

  &:hover {
    .guide-wrapper {
      pointer-events: auto;
      .guide {
        pointer-events: auto;
      }
    }
  }
`

// ------------------------------------------------ util
const makeContainerStyle = (vertical: boolean, breadth: number, showGuide: boolean, color: string) =>
  vertical
    ? {
        width: `${breadth}px`,
        height: `calc(100% - ${breadth}px)`,
        top: `${breadth}px`,
        left: 0,
        borderRight: showGuide ? `1px solid ${color}` : '0px'
      }
    : {
        width: `calc(100% - ${breadth}px)`,
        height: `${breadth}px`,
        left: `${breadth}px`,
        top: 0,
        borderBottom: showGuide ? `1px solid ${color}` : '0px'
      }

// ------------------------------------------------ comp
export const RulerLayer: React.FC<IRulerLayer> = (props) => {
  const { breadth, style, controls, guides } = useContext<IEpubRuler>(RulerContext)
  const { vertical } = props
  const [pseudoDisplay, showPseudoLine] = useState<boolean>(false)

  const rulerLayerStyle = makeContainerStyle(vertical, breadth, controls.showRuler, style?.layerStyle?.borderColor)

  const handleLayerHover = () => showPseudoLine(true)
  const handleLayerLeave = () => showPseudoLine(false)

  const handleLayerMove = () => console.log('')

  return useMemo(() => {
    // console.log('layer re-render') // Performance Testing
    return (
      <WrapperRulerLayer
        className="scale-container"
        style={rulerLayerStyle}
        onMouseEnter={handleLayerHover}
        onMouseLeave={handleLayerLeave}
        onMouseMove={handleLayerMove}
      >
        {controls.showRuler && <Ruler vertical={vertical} />}
        {controls.showGuide
          ? vertical
            ? guides.v.map((v, i) => <Guide key={String(i + v)} value={v} index={i} vertical={vertical} />)
            : guides.h.map((v, i) => <Guide key={String(i + v)} value={v} index={i} vertical={vertical} />)
          : null}
        {controls.showPseudoLine && pseudoDisplay && <PseudoLine />}
      </WrapperRulerLayer>
    )
  }, [vertical, rulerLayerStyle, controls, guides])
}
