const FONT_SCALE = 0.83 // 10 / 12 display smaller font

export const clearCanvas = (breadth: number, length: number, vertical: boolean, ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, vertical ? breadth : length, vertical ? length : breadth)
}

export const getScaleValue = (offset: number, start: number, scale: number) => {
  return Math.round(start + offset / scale)
}

export const getOffsetValue = (vertical: boolean, startX: number, startY: number, value: number, scale: number) => {
  return vertical ? (value - startY) * scale : (value - startX) * scale
}

interface IDrawRuler {
  scale: number
  ratio: number
  vertical: boolean
  breadth: number
  start: number
  length: number
  selectStart: number
  selectLength: number
  ctx: CanvasRenderingContext2D
  rulerStyle: any
}

export const drawRuler = (props: IDrawRuler) => {
  const { scale, ratio, vertical, breadth, start, length, selectStart, selectLength, ctx, rulerStyle } = props

  drawScaleInit(length, breadth, ctx, ratio)
  drawScaleBgColor(vertical, length, breadth, ctx, rulerStyle.bgColor)

  drawScaleShadow(vertical, scale, breadth, selectStart, selectLength, ctx, rulerStyle.shadowColor)
  drawScaleLargeAndFont(
    vertical,
    scale,
    ratio,
    start,
    length,
    breadth,
    ctx,
    rulerStyle.scaleLargeColor,
    rulerStyle.scaleFontColor
  )
  drawScaleSmall(vertical, scale, start, length, breadth, ctx, rulerStyle.scaleSmallColor)

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

const getGridSize = (scale: number) => {
  if (scale <= 0.25) return 40
  if (scale <= 0.5) return 20
  if (scale <= 1) return 10
  if (scale <= 2) return 5
  if (scale <= 4) return 2
  return 1
}

const getDrawValue = (scale: number, start: number, value: number) => {
  const gridSizeSmall = getGridSize(scale) // small scale width
  const gridSizeLarge = gridSizeSmall * 10 // large scale width
  const gridPixelSmall = gridSizeSmall * scale
  const gridPixelLarge = gridSizeLarge * scale

  const startValueSmall = Math.floor(start / gridSizeSmall) * gridSizeSmall // small scale start coordinate
  const startValueLarge = Math.floor(start / gridSizeLarge) * gridSizeLarge // large scale start coordinate

  const offsetSmall = ((startValueSmall - start) / gridSizeSmall) * gridPixelSmall // original point --> starting point of small scale
  const offsetLarge = ((startValueLarge - start) / gridSizeLarge) * gridPixelLarge // original point --> starting point of large scale
  const endValue = start + Math.ceil(value / scale) // destination

  return {
    gridSizeSmall,
    gridSizeLarge,
    gridPixelSmall,
    gridPixelLarge,
    startValueSmall,
    startValueLarge,
    offsetSmall,
    offsetLarge,
    endValue
  }
}

const drawScaleInit = (length: number, breadth: number, ctx: CanvasRenderingContext2D, ratio: number) => {
  ctx.scale(ratio, ratio)
  ctx.clearRect(0, 0, length, breadth)
}
const drawScaleBgColor = (
  vertical: boolean,
  length: number,
  breadth: number,
  ctx: CanvasRenderingContext2D,
  bgColor: string
) => {
  ctx.fillStyle = bgColor
  if (vertical) {
    ctx.fillRect(0, 0, breadth, length)
  } else {
    ctx.fillRect(0, 0, length, breadth)
  }
}
const drawScaleShadow = (
  vertical: boolean,
  scale: number,
  breadth: number,
  selectStart: number,
  selectLength: number,
  ctx: CanvasRenderingContext2D,
  shadowColor: string
) => {
  ctx.fillStyle = shadowColor
  let shadowX: number, shadowY: number, shadowWidth: number, shadowHeight: number
  if (vertical) {
    shadowX = (breadth * 4) / 8
    shadowY = -selectStart * scale
    shadowWidth = (breadth * 4) / 8
    shadowHeight = selectLength * scale
  } else {
    shadowX = -selectStart * scale
    shadowY = (breadth * 4) / 8
    shadowWidth = selectLength * scale
    shadowHeight = (breadth * 4) / 8
  }
  ctx.fillRect(shadowX, shadowY, shadowWidth, shadowHeight)
}
const drawScaleLargeAndFont = (
  vertical: boolean,
  scale: number,
  ratio: number,
  start: number,
  length: number,
  breadth: number,
  ctx: CanvasRenderingContext2D,
  scaleLargeColor: string,
  scaleFontColor: string
) => {
  const { gridSizeLarge, gridPixelLarge, startValueLarge, offsetLarge, endValue } = getDrawValue(scale, start, length)
  ctx.beginPath()
  ctx.fillStyle = scaleFontColor
  ctx.strokeStyle = scaleLargeColor
  for (let value = startValueLarge, count = 0; value < endValue; value += gridSizeLarge, count++) {
    if (vertical) {
      const y = offsetLarge + count * gridPixelLarge + 0.5
      ctx.moveTo(breadth, y)
      ctx.save()
      ctx.translate(breadth * 0.1, y)
      ctx.rotate(-Math.PI / 2) // 旋转 -90 度
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio)
      ctx.fillText(value.toString(), 4 * ratio, 7 * ratio)
      ctx.restore()
      ctx.lineTo(0, y)
    } else {
      const x = offsetLarge + count * gridPixelLarge + 0.5
      ctx.moveTo(x, breadth)
      ctx.save()
      ctx.translate(x, breadth * 0.1)
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio)
      ctx.fillText(value.toString(), 4 * ratio, 7 * ratio)
      ctx.restore()
      ctx.lineTo(x, 0)
    }
  }
  ctx.stroke()
  ctx.closePath()
}
const drawScaleSmall = (
  vertical: boolean,
  scale: number,
  start: number,
  length: number,
  breadth: number,
  ctx: CanvasRenderingContext2D,
  scaleSmallColor: string
) => {
  const { gridSizeSmall, gridPixelSmall, startValueSmall, offsetSmall, endValue } = getDrawValue(scale, start, length)
  ctx.beginPath()
  ctx.strokeStyle = scaleSmallColor
  for (let value = startValueSmall, count = 0; value < endValue; value += gridSizeSmall, count++) {
    if (vertical) {
      const y = offsetSmall + count * gridPixelSmall + 0.5
      ctx.moveTo(breadth, y)
      if (value % (gridSizeSmall * 10) !== 0) {
        ctx.lineTo((breadth * 5) / 8, y)
      }
    } else {
      const x = offsetSmall + count * gridPixelSmall + 0.5
      ctx.moveTo(x, breadth)
      if (value % (gridSizeSmall * 10) !== 0) {
        ctx.lineTo(x, (breadth * 5) / 8)
      }
    }
  }
  ctx.stroke()
  ctx.closePath()
}
