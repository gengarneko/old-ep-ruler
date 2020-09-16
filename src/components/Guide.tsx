import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { RulerContext, RulerActions, IEpubRuler } from '../index'
import { getOffsetValue } from '../utils/utils'

// ------------------------------------------------ inter
interface IGuide {
  vertical: boolean
  value: number
  index: number
}

// ------------------------------------------------ style
const WrapperGuideContainer = styled.div`
  position: absolute;
  pointer-events: none;
  font-size: 12px;
  top: 0;
  left: 0;
`
const WrapperHorizontalGuide = styled.div`
  position: absolute;
  cursor: ew-resize;
  line-height: 0;
  padding-right: 4px;
`
const WrapperVerticalGuide = styled.div`
  position: absolute;
  cursor: ns-resize;
  line-height: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
`
const WrapperActions = styled.div`
  display: flex;
  position: absolute;
`
const WrapperNumber = styled.span`
  padding: 4px;
  align-self: flex-start;
  max-width: 2.5rem;
  text-align: center;
`

// ------------------------------------------------ comp
export const Guide: React.FC<IGuide> = (props) => {
  const { vertical, value, index } = props
  const { dispatch } = useContext(RulerActions)
  const [number, setNumber] = useState<number>(value)
  const [numberDisplay, setNumberDisplay] = useState<boolean>(false)
  const [isDragged, setIsDragged] = useState<boolean>(false)
  const context = useContext<IEpubRuler>(RulerContext)
  const offset = getOffsetValue(vertical, context.startX, context.startY, number, context.scale)

  // ------------------------------------------------ style
  const guideStyle = context.style.guideStyle
  const newStyle = {
    willChange: 'transform',
    transform: vertical ? `translateY(${offset}px)` : `translateX(${offset}px)`
  }
  const actionsStyle = {
    marginLeft: vertical ? '20px' : '0',
    marginTop: vertical ? '0' : '20px',
    display: 'flex'
  }

  // ------------------------------------------------ func
  const handleGuideOver = () => {
    setNumberDisplay(true)
  }

  const handleGuideOut = () => {
    if (!isDragged) {
      setNumberDisplay(false)
    }
  }

  const handleGuideDown = (e: React.MouseEvent<HTMLElement>) => {
    const startD = vertical ? e.clientY : e.clientX
    // onMouseDown()
    const onMove = (e: any) => {
      const currentD = vertical ? e.clientY : e.clientX
      const newValue = Math.round(number + (currentD - startD) / context.scale)
      setNumber(newValue)
      setIsDragged(true)
    }
    const onEnd = (e: any) => {
      const currentD = vertical ? e.clientY : e.clientX
      const newValue = Math.round(value + (currentD - startD) / context.scale)
      releaseGuide(index, vertical, newValue)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
  }

  const releaseGuide = (index: number, vertical: boolean, value: number) => {
    const { width, height, scale, startX, startY } = context
    const offset = value - (vertical ? startY : startX)
    const maxOffset = (vertical ? height : width) / scale
    setIsDragged(false)
    return offset < 0 || offset > maxOffset ? removeGuide(vertical, index) : updateGuide(vertical, value, index)
  }

  const updateGuide = (vertical: boolean, value: number, index: number) => {
    dispatch({ type: 'updateGuide', payload: { vertical: vertical, value: value, index: index } })
  }

  const removeGuide = (vertical: boolean, index: number) => {
    dispatch({ type: 'removeGuide', payload: { vertical: vertical, index: index } })
  }

  // TODO: refactor wapperguide
  return (
    <WrapperGuideContainer
      className="guide-wrapper"
      style={newStyle}
      onMouseOver={handleGuideOver}
      onMouseOut={handleGuideOut}
      onMouseDown={handleGuideDown}
    >
      {vertical ? (
        <WrapperVerticalGuide className="guide" style={{ cursor: 'ns-resize' }}>
          <svg width="100vw" height={1} style={{ backgroundColor: guideStyle.color }} />
        </WrapperVerticalGuide>
      ) : (
        <WrapperHorizontalGuide className="guide" style={{ cursor: 'ew-resize' }}>
          <svg width={1} height="100vh" style={{ backgroundColor: guideStyle.color }} />
        </WrapperHorizontalGuide>
      )}
      {(numberDisplay || context.controls.showNumber) && (
        <WrapperActions className="guide-actions" style={actionsStyle}>
          <WrapperNumber
            className="guide-number"
            style={{ backgroundColor: guideStyle.valueBgColor, color: guideStyle.valueColor }}
          >
            {number}
          </WrapperNumber>
        </WrapperActions>
      )}
    </WrapperGuideContainer>
  )
}
