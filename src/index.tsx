import React, { createContext, useEffect } from 'react'
// import { useMemo } from 'react'
import styled from 'styled-components'
import { useImmerReducer } from 'use-immer'
import { RulerLayer } from './components/RulerLayer'

// ------------------------------------------------ inter
export interface RulerActionType {
  updateRuler: () => void
  clearGuides: () => void
}
export interface IEpubRuler {
  ratio: number
  scale: number
  breadth: number
  startX: number
  startY: number
  width: number
  height: number

  guides: { h: number[]; v: number[] }

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

  controls: {
    showRuler: boolean
    showGuide: boolean
    showPseudoLine: boolean
    showNumber: boolean
  }

  style: {
    layerStyle: {
      borderColor: string
    }
    rulerStyle: {
      bgColor: string
      scaleSmallColor: string
      scaleLargeColor: string
      scaleFontColor: string
      shadowColor: string
    }
    guideStyle: {
      color: string
      removeColor: string
      valueColor: string
      valueBgColor: string
    }
  }
  actionRef?: React.MutableRefObject<RulerActionType | undefined | null> | ((actionRef: RulerActionType) => void)
  rulerRefreshTrigger?: number
  updateRuler?: (lines: { h: number[]; v: number[] }) => void
}
export interface IEpubRulerProps {
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
}

// ------------------------------------------------ init
const initialState: IEpubRuler = {
  ratio: window.devicePixelRatio || 1,
  scale: 1,
  breadth: 20,
  startX: 0,
  startY: 0,
  width: 0,
  height: 0,
  guides: { h: [10, 20], v: [20, 40] },
  // rulerValue: {
  //   width: 1000,
  //   height: 500,
  //   startX: 30,
  //   startY: 40,
  //   selectWidth: 80,
  //   selectHeight: 60,
  //   selectX: 50,
  //   selectY: 60
  // },
  // listenDOM: {
  //   screen: document.body,
  //   editor: document.body,
  //   select: document.body
  // },
  controls: {
    showRuler: true,
    showGuide: true,
    showPseudoLine: true,
    showNumber: false
  },
  style: {
    layerStyle: {
      borderColor: '#a0aec0'
    },
    rulerStyle: {
      bgColor: 'rgba(225,225,225, 0)', // ruler bg color
      scaleLargeColor: '#a0aec0', // ruler longer mark color
      scaleSmallColor: '#a0aec0', // ruler shorter mark color
      scaleFontColor: 'black', // ruler font color
      shadowColor: 'rgb(185, 200, 253)' // ruler shadow color
    },
    guideStyle: {
      color: '#EB5648',
      removeColor: '#000000',
      valueColor: '#E8E8E8',
      valueBgColor: 'rgb(235, 86, 72, 0.6)'
    }
  },
  updateRuler: () => console.log(123),
  rulerRefreshTrigger: 0
}

// ------------------------------------------------ style
const WrapperEpubRuler = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
`
const WrapperCorner = styled.div`
  background-color: #4a5568;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
`

// ------------------------------------------------ reducer
export const RulerContext = createContext<IEpubRuler>(initialState)
export const RulerActions = createContext<any>({})

type actionType =
  | 'refresh'
  | 'increment'
  | 'update'
  | 'refreshRuler'
  | 'addGuide'
  | 'setStart'
  | 'setWidthAndHeight'
  | 'removeGuide'
  | 'updateGuide'
const reducer = (draft: any, action: { type: actionType; payload: any }) => {
  const vertical = action.payload.vertical
  const value = action.payload.value
  const index = action.payload.index
  const length = action.payload.length
  switch (action.type) {
    case 'refresh':
      console.log(12) // TODO
      return
    case 'refreshRuler':
      draft.rulerRefreshTrigger = (draft.rulerRefreshTrigger + 1) % 7
      return
    case 'increment':
      draft.scale += action.payload
      return
    case 'update':
      return { ...draft, ...action.payload }
    case 'setStart':
      vertical ? (draft.startY = action.payload.startValue) : (draft.startX = action.payload.startValue)
      return
    case 'setWidthAndHeight':
      vertical ? (draft.height = length) : (draft.width = length)
      return
    case 'addGuide':
      vertical ? draft.guides.v.push(value) : draft.guides.h.push(value)
      return
    case 'removeGuide':
      vertical ? draft.guides.v.splice(index, 1) : draft.guides.h.splice(index, 1)
      return
    case 'updateGuide':
      vertical ? (draft.guides.v[index] = value) : (draft.guides.h[index] = value)
  }
}

// ------------------------------------------------ comp
const CornerContainer: React.FC<{ breadth: number }> = (props) => {
  const { breadth } = props
  return <WrapperCorner style={{ width: breadth, height: breadth }} />
}

export const EpubRuler = (props: IEpubRulerProps) => {
  const { actionRef } = props
  const [store, dispatch] = useImmerReducer(reducer, {
    ...initialState,
    ...props
  })

  // useImperativeHandle(actionRef, () => ({
  //   updateRuler: () => {
  //     console.log('update')
  //   },
  //   clearGuides: () => {
  //     console.log('clear')
  //   }
  // }))

  useEffect(() => {
    const userAction: RulerActionType = {
      updateRuler: () => {
        dispatch({ type: 'refreshRuler', payload: {} })
      },
      clearGuides: () => {
        console.log('clear')
      }
    }
    if (actionRef && typeof actionRef === 'function') actionRef(userAction)
    if (actionRef && typeof actionRef !== 'function') actionRef.current = userAction
  }, [])

  useEffect(() => {
    const updateStore = () => {
      dispatch({ type: 'update', payload: props })
    }
    updateStore()
  }, [props])

  // TODO: useMemo: Cause the update to be delayed

  // return useMemo(() => {
  //   console.log('epub ruler re-render') // Performance Testing
  //   return (
  //     <RulerContext.Provider value={store}>
  //       <RulerActions.Provider value={{ dispatch }}>
  //         <WrapperEpubRuler>
  //           <RulerLayer vertical={false} />
  //           <RulerLayer vertical={true} />
  //           <CornerContainer breadth={20} />
  //         </WrapperEpubRuler>
  //       </RulerActions.Provider>
  //     </RulerContext.Provider>
  //   )
  // }, [props])

  return (
    <RulerContext.Provider value={store}>
      <RulerActions.Provider value={{ dispatch }}>
        <WrapperEpubRuler>
          <RulerLayer vertical={false} />
          <RulerLayer vertical />
          <CornerContainer breadth={20} />
        </WrapperEpubRuler>
      </RulerActions.Provider>
    </RulerContext.Provider>
  )
}
  