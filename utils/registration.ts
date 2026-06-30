export function isRegistrationClosed(closesAt: Date | null) {
  return closesAt !== null && closesAt <= new Date()
}
