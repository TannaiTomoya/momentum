import { featureLabel } from '../data/ifLab'
import { liveFeatureOn } from '../engine/ifLabSession'
import type { IfLabKind, IfLabSpec } from '../engine/types'

type Props = {
  spec: IfLabSpec
  typed: string
}

function onState(spec: IfLabSpec, typed: string): boolean {
  const live = liveFeatureOn(spec, typed)
  if (live === null) return false
  return live
}

export function IfLabPreview({ spec, typed }: Props) {
  const on = onState(spec, typed)
  const waiting = typed.trim() === '' || liveFeatureOn(spec, typed) === null

  return (
    <div className={`if-lab-preview${waiting ? ' is-waiting' : on ? ' is-on' : ''}`}>
      <MiniUi kind={spec.kind} spec={spec} on={on} />
      <p className="if-lab-status">
        {waiting ? '入力すると画面が変わる' : featureLabel(spec.kind, on)}
      </p>
    </div>
  )
}

function MiniUi({
  kind,
  spec,
  on,
}: {
  kind: IfLabKind
  spec: IfLabSpec
  on: boolean
}) {
  switch (kind) {
    case 'age-gate':
      return (
        <div className={`mini-video${on ? ' blocked' : ''}`}>
          <span className="mini-play">▶</span>
          <span>動画を再生</span>
          {on && <div className="mini-modal">視聴できません</div>}
        </div>
      )
    case 'score-badge':
      return (
        <div className="mini-score">
          <span className="mini-score-num">{String(spec.current)}</span>
          <span className={`mini-badge${on ? ' lit' : ''}`}>優</span>
        </div>
      )
    case 'stock':
      return (
        <div className="mini-stock">
          <button type="button" className="mini-buy" disabled={on}>
            {on ? '売り切れ' : 'カートに入れる'}
          </button>
        </div>
      )
    case 'input-error':
      return (
        <div className="mini-form">
          <input
            className={`mini-field${on ? ' error' : ''}`}
            readOnly
            value={spec.current === '' ? '' : String(spec.current)}
            placeholder="名前"
          />
          {on && <span className="mini-error">必須です</span>}
        </div>
      )
    case 'weather':
      return (
        <div className={`mini-weather${on ? ' heat' : ''}`}>
          {on ? '猛暑です。外出は控えましょう' : 'きょうの天気'}
          <span className="mini-temp">{String(spec.current)}°</span>
        </div>
      )
    case 'cart':
      return (
        <div className="mini-cart">
          <span className="mini-cart-icon">🛒</span>
          {on && <span className="mini-cart-badge">{String(spec.current)}</span>}
        </div>
      )
    case 'member':
      return (
        <div className="mini-price">
          <span className={`mini-price-tag${on ? ' member' : ''}`}>
            {on ? '会員料金' : '通常料金'}
          </span>
        </div>
      )
  }
}
