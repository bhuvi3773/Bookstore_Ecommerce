import { Icon } from './Icon'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (next: number) => void
  label?: string
  small?: boolean
}

export function QuantityStepper({ value, min = 1, max, onChange, label = 'Quantity', small = false }: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  return (
    <div className={`stepper ${small ? 'stepper--small' : ''}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={small ? 13 : 15} />
      </button>
      <input
        className="stepper__input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={`${label}: ${value}`}
        onChange={(event) => {
          const parsed = Number(event.target.value)
          if (Number.isFinite(parsed)) onChange(clamp(Math.round(parsed)))
        }}
      />
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={small ? 13 : 15} />
      </button>
    </div>
  )
}
