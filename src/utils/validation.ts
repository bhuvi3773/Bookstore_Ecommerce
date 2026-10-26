export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export const isValidPhone = (value: string) => /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))

export const isValidPincode = (value: string) => /^\d{6}$/.test(value.trim())

export const required = (value: string, min = 1) => value.trim().length >= min
