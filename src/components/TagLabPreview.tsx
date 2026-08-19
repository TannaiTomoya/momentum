import { featureLabel } from '../data/tagLab'
import { liveTagToken } from '../engine/tagLabSession'
import type { TagLabSpec, TagToken } from '../engine/types'

type Props = {
  spec: TagLabSpec
  typed: string
}

export function TagLabPreview({ spec, typed }: Props) {
  const live = liveTagToken(typed)
  const waiting = typed.trim() === '' || live === null
  const on = !waiting && live === spec.token

  return (
    <div
      className={`if-lab-preview tag-lab-preview${waiting ? ' is-waiting' : on ? ' is-on' : ''}`}
    >
      <MiniUi spec={spec} live={waiting ? null : live} />
      <p className="if-lab-status">
        {waiting
          ? '入力すると画面が変わる'
          : live
            ? featureLabel(live)
            : '入力すると画面が変わる'}
      </p>
    </div>
  )
}

function MiniUi({
  spec,
  live,
}: {
  spec: TagLabSpec
  live: TagToken | null
}) {
  switch (spec.kind) {
    case 'skeleton':
    case 'lp':
      return <PageMini spec={spec} live={live} />
    case 'table':
      return <TableMini spec={spec} live={live} />
    case 'form':
      return <FormMini spec={spec} live={live} />
    case 'box':
      return <BoxMini live={live} />
    case 'flex':
      return <FlexMini spec={spec} live={live} />
    case 'center':
      return <CenterMini live={live} />
  }
}

function lit(live: TagToken | null, token: TagToken): string {
  return live === token ? ' is-lit' : ''
}

function PageMini({ spec, live }: { spec: TagLabSpec; live: TagToken | null }) {
  const skills = spec.skills ?? ['HTML', 'CSS', 'JavaScript']
  const isLp = spec.kind === 'lp'
  const flexOn = live === 'flex'
  const copyOn = live === 'copy'

  return (
    <div className={`mini-page${lit(live, 'body')}`}>
      <div className={`mini-page-header${lit(live, 'header')}`}>
        {isLp ? 'TOM.dev' : 'header'}
      </div>
      {isLp && <div className="mini-page-hero">HELLO, I'M TOM</div>}
      <div className={`mini-page-main${lit(live, 'main')}`}>
        {isLp ? (
          <>
            <p className="mini-page-about">セブ島IT勉強会で学習中</p>
            <div className={`mini-skill-row${flexOn ? ' is-flex' : ''}`}>
              {skills.map((skill) => (
                <span key={skill} className="mini-skill-card">
                  {skill}
                </span>
              ))}
            </div>
          </>
        ) : (
          'main'
        )}
      </div>
      <div className={`mini-page-footer${lit(live, 'footer')}`}>
        {copyOn || isLp ? '© 2026 TOM' : 'footer'}
      </div>
    </div>
  )
}

function TableMini({ spec, live }: { spec: TagLabSpec; live: TagToken | null }) {
  const headers = spec.tableHeaders ?? ['A', 'B']
  const rows = spec.tableRows ?? [
    ['1', '2'],
    ['3', '4'],
  ]

  return (
    <table className={`mini-table${lit(live, 'tr')}`}>
      <thead>
        <tr className={live === 'tr' ? 'is-lit' : undefined}>
          {headers.map((cell) => (
            <th key={cell} className={live === 'th' ? 'is-lit' : undefined}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join('-')} className={live === 'tr' ? 'is-lit' : undefined}>
            {row.map((cell) => (
              <td key={cell} className={live === 'td' ? 'is-lit' : undefined}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function FormMini({ spec, live }: { spec: TagLabSpec; live: TagToken | null }) {
  const label = spec.fieldLabel ?? 'お名前'
  const id = spec.fieldId ?? 'name'
  const isPassword = live === 'password'
  const isEmail = live === 'email'
  const showRequired = live === 'required'
  const labelOn = live === 'label'

  return (
    <div className="mini-form-lab">
      <label className={labelOn ? 'is-lit' : undefined} htmlFor={id}>
        {label}
        {showRequired ? '（必須）' : ''}
      </label>
      <input
        className={`mini-field${showRequired ? ' error' : ''}${labelOn ? ' is-lit' : ''}`}
        readOnly
        type={isPassword ? 'password' : isEmail ? 'email' : 'text'}
        value={isPassword ? 'secret' : isEmail ? 'tom@mail.com' : ''}
        placeholder={isEmail ? 'mail@example.com' : id}
      />
      {showRequired && <span className="mini-error">このフィールドを入力してください</span>}
    </div>
  )
}

function BoxMini({ live }: { live: TagToken | null }) {
  return (
    <div className={`mini-box-outer${live === 'margin' ? ' is-lit' : ''}`}>
      <div className={`mini-box-inner${live === 'padding' ? ' is-lit' : ''}`}>
        content
      </div>
    </div>
  )
}

function FlexMini({ spec, live }: { spec: TagLabSpec; live: TagToken | null }) {
  const skills = spec.skills ?? ['HTML', 'CSS', 'JavaScript']
  return (
    <div className={`mini-skill-row${live === 'flex' ? ' is-flex' : ''}`}>
      {skills.map((skill) => (
        <span key={skill} className="mini-skill-card">
          {skill}
        </span>
      ))}
    </div>
  )
}

function CenterMini({ live }: { live: TagToken | null }) {
  return (
    <div className="mini-center-track">
      <div className={`mini-center-block${live === 'center' ? ' is-center' : ''}`}>
        max-width
      </div>
    </div>
  )
}
