import React, { useState, useEffect, useRef } from 'react'

import { EpubRuler, RulerActionType } from 'ep-ruler'
import 'ep-ruler/dist/index.css'
import styled from 'styled-components'

const App = () => {
  const [rulerAttr, setRulerAttr] = useState<{
    isShowRuler: boolean
    isShowScaleLine: boolean
    isShowReferLine: boolean
  }>({
    isShowRuler: true,
    isShowScaleLine: true,
    isShowReferLine: true
  })

  const [scale, setScale] = useState(1)
  const [lines, setLines] = useState<{ h: number[]; v: number[] }>({
    h: [],
    v: []
  })

  const updateLines = (lines: { h: number[]; v: number[] }) => {
    console.log(lines.h)
    console.log(lines.v)
    setLines(lines)
  }

  useEffect(() => {
    if (targetScreenRef.current !== null && targetContainerRef.current !== null) {
      const targetScreen = targetScreenRef.current
      const targetContainer = targetContainerRef.current
      targetScreen.scrollLeft = targetContainer.getBoundingClientRect().width / 2 - 300
      targetScreen.scrollTop = targetContainer.getBoundingClientRect().height / 2 - 50
    }
  }, [])

  const updateRulerAttr = (obj: Partial<any>) => {
    setRulerAttr({ ...rulerAttr, ...obj })
  }
  const handleShowRuler = () => {
    updateRulerAttr({ isShowRuler: !rulerAttr.isShowRuler })
  }
  const handleShowScaleLine = () => {
    updateRulerAttr({ isShowScaleLine: !rulerAttr.isShowScaleLine })
  }
  const handleShowReferLine = () => {
    updateRulerAttr({ isShowReferLine: !rulerAttr.isShowReferLine })
  }
  const handleChangeScale = (val: any) => {
    setScale(Number(val))
  }

  const targetScreenRef = useRef<HTMLDivElement | null>(null)
  const targetContainerRef = useRef<HTMLDivElement | null>(null)
  const activeCanvasRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const activeItemRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const childRef = useRef<RulerActionType | null>(null)
  const handleScroll = () => {
    // console.log(childRef.current, 'wwwwwwwwwwwwwwwwwwwwwww')
    childRef.current?.updateRuler()
  }

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

  const renderRuler = () => {
    return (
      <EpubRuler
        listenDOM={auto}
        // rulerValue={manual}
        scale={scale}
        guides={lines}
        actionRef={childRef}
        // style={style}
        updateRuler={updateLines}
      />
    )
  }

  return (
    <Layout>
      {/* 工具栏 */}
      <div
        style={{
          boxSizing: 'border-box',
          padding: '1rem',
          marginBottom: '4rem',
          display: 'flex',
          marginLeft: '4rem',
          marginRight: '4rem',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            marginTop: '2rem',
            borderRadius: '0.25rem',
            padding: '1rem',
            backgroundColor: '#edf2f7'
          }}
        >
          <label htmlFor="scale">选择缩放比例:</label>
          <select
            name="scale"
            id="scale"
            style={{
              border: 'border-radius: 0.25rem',
              backgroundColor: '#f7fafc'
            }}
            onChange={(e) => handleChangeScale(e.target.value)}
          >
            <option value="1">1</option>
            <option value="0.25">0.25</option>
            <option value="0.5">0.5</option>
            <option value="1.25">1.25</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        {false && (
          <>
            <Button onClick={handleShowRuler} style={{ borderRadius: '0.25rem', marginRight: '1rem' }}>
              {rulerAttr.isShowRuler ? '显示' : '隐藏'}标尺
            </Button>
            <Button onClick={handleShowScaleLine} style={{ borderRadius: '0.25rem', marginRight: '1rem' }}>
              {rulerAttr.isShowScaleLine ? '显示' : '隐藏'}刻度线
            </Button>
            <Button onClick={handleShowReferLine} style={{ borderRadius: '0.25rem', marginRight: '1rem' }}>
              {rulerAttr.isShowReferLine ? '显示' : '隐藏'}参考线
            </Button>
            <Button style={{ borderRadius: '0.25rem', marginRight: '1rem' }}>切换主题</Button>
            <Button style={{ borderRadius: '0.25rem' }}>待定功能</Button>
          </>
        )}
      </div>
      <Container style={{ position: 'relative' }}>
        {/* 编辑器标尺 */}
        {/* 缩放滚动的时候都要动态传入新值 */}
        {rulerAttr.isShowRuler && renderRuler()}
        {/* 编辑区域 */}
        <TargetScreen
          style={{ backgroundColor: '#fff' }}
          className="screen"
          ref={targetScreenRef}
          onScroll={handleScroll}
        >
          <TargetContainer className="target-container" ref={targetContainerRef}>
            <WrapperActiveCanvas className="editor" ref={activeCanvasRef}>
              <WrapperActiveItem className="select active-item" ref={activeItemRef}></WrapperActiveItem>
            </WrapperActiveCanvas>
          </TargetContainer>
        </TargetScreen>
      </Container>
    </Layout>
  )
}

const Layout = styled.div`
  width: 100%;
  border: 1px solid black;
  padding-top: 2rem;
  line-height: 1;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  @media (min-width: 640px) {
    max-width: 640px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 1024px) {
    max-width: 1024px;
  }

  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
`

const WrapperActiveCanvas = styled.div`
  background-color: #b2f5ea;
  position: absolute;
  top: 51%;
  right: 50%;
  bottom: 50%;
  left: 51%;
  width: 510px;
  height: 320px;
`
const WrapperActiveItem = styled.div`
  background-color: #81e6d9;
  position: absolute;
  top: 50%;
  right: 50%;
  bottom: 50%;
  left: 50%;
  width: 220px;
  height: 90px;
`
const Container = styled.div`
  max-width: 1214px;
  height: 500px;
  margin: 0 auto;
`
const Button = styled.button`
  background: rgb(237, 242, 247);
  padding: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
`
const TargetScreen = styled.div`
  &::-webkit-scrollbar {
    // display: none;
  }
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`
const TargetContainer = styled.div`
  position: absolute;
  width: 5000px;
  height: 3000px;
`

export default App
