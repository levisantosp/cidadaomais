import { env } from '../env'

const EPOCH = 1767225600000n
const MAX_TIMESTAMP = (1n << 41n) - 1n
const MAX_SEQUENCE = 4095n
const CLOCK_ROLLBACK_TOLERANCE = 5n
const MAX_WAIT_MS = 25

const MACHINE_ID = env.MACHINE_ID

let lastTimestamp = -1n
let sequence = 0n

export const snowflake = () => {
  let timestamp = BigInt(Date.now()) - EPOCH

  if (timestamp < 0n) {
    throw new Error(
      `Current time is before the custom epoch '${EPOCH}'. Check the server clock.`
    )
  }

  if (timestamp < lastTimestamp) {
    const drift = lastTimestamp - timestamp
    if (drift > CLOCK_ROLLBACK_TOLERANCE) {
      throw new Error(
        `Clock moved backwards by ${drift}ms. Refusing to generate ID.`
      )
    }

    const start = Date.now()

    while (timestamp < lastTimestamp) {
      if (Date.now() - start > MAX_WAIT_MS) {
        throw new Error('Timed out waiting for clock recovery after rollback.')
      }
      timestamp = BigInt(Date.now()) - EPOCH
    }
  }

  if (timestamp === lastTimestamp) {
    sequence += 1n

    if (sequence > MAX_SEQUENCE) {
      const start = Date.now()

      do {
        if (Date.now() - start > MAX_WAIT_MS) {
          throw new Error(
            'Timed out waiting for the next millisecond. Per-node capacity exceeded.'
          )
        }
        timestamp = BigInt(Date.now()) - EPOCH
      } while (timestamp <= lastTimestamp)

      sequence = 0n
    }
  } else {
    sequence = 0n
  }

  if (timestamp > MAX_TIMESTAMP) {
    throw new Error('Timestamp overflow. Snowflake lifetime exceeded.')
  }

  lastTimestamp = timestamp

  return (timestamp << 22n) | (MACHINE_ID << 12n) | sequence
}