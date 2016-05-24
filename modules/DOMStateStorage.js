/* eslint-disable no-empty */
import warning from 'warning'

const QuotaExceededErrors = [
  'QuotaExceededError',
  'QUOTA_EXCEEDED_ERR'
]

const SecurityError = 'SecurityError'
const KeyPrefix = '@@History/'

const createKey = (key) =>
  KeyPrefix + key

export const saveState = (key, state) => {
  try {
    if (state == null) {
      window.sessionStorage.removeItem(createKey(key))
    } else {
      window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
    }
  } catch (error) {
    if (!window.sessionStorage) {
      // Session storage is not available or hidden.
      // sessionStorage is undefined in Internet Explorer when served via file protocol.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not accessible'
      )

      return
    }

    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not available due to security settings'
      )

      return
    }

    if (QuotaExceededErrors.indexOf(error.name) >= 0 && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not available in Safari private mode'
      )

      return
    }

    throw error
  }
}

export const readState = (key) => {
  let json
  try {
    json = window.sessionStorage.getItem(createKey(key))
  } catch (error) {

    if (!window.sessionStorage) {
      // Session storage is not available or hidden.
      // sessionStorage is undefined in Internet Explorer when served via file protocol.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not accessible'
      )

      return undefined
    }

    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      warning(
        false,
        '[history] Unable to read state; sessionStorage is not available due to security settings'
      )

      return undefined
    }
  }

  if (json) {
    try {
      return JSON.parse(json)
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return undefined
}
