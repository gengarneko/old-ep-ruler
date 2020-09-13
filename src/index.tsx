import * as React from 'react'
// import styles from './styles.module.css'

interface IEpubRuler {
  scale?: number
}
export const EpubRuler: React.FC<IEpubRuler> = (props) => {
  const { scale } = props
  return <div>{scale}epub ruler</div>
}
