import { env } from '../env'

let lastTimestamp = -1n
let sequence = 0n

export const snowflake = () => {
  const epoch = 1767225600000n
  let timestamp = BigInt(Date.now()) - epoch

  if (timestamp < 0n) {
    throw new Error(
      `Current time is before the custom epoch '${epoch}'. Check the server clock.`
    )
  }

  if (timestamp < lastTimestamp) {
    throw new Error(
      'Clock moved backwards. Refusing to generate ID to prevent duplicates.'
    )
  }

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1n) & 0xfffn
    if (!sequence) {
      sequence = 0n
      timestamp = lastTimestamp + 1n
    }
  } else {
    sequence = 0n
  }

  lastTimestamp = timestamp

  const timestampPart = timestamp << 22n
  const machinePart = (env.MACHINE_ID & 1023n) << 12n

  return timestampPart | machinePart | sequence
}
