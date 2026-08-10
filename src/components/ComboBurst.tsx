type Props = {
  label: string | null
  burstKey: number
}

export function ComboBurst({ label, burstKey }: Props) {
  if (!label) return null
  return (
    <div className="burst-layer" aria-hidden>
      <div key={burstKey} className="burst-label">
        {label}
      </div>
    </div>
  )
}
