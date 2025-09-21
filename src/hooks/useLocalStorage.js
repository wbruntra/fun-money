import { useState, useEffect } from 'react'
import { getStorageItem, setStorageItem } from '../utils'

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorageItem(key, defaultValue))

  useEffect(() => {
    setStorageItem(key, value)
  }, [key, value])

  return [value, setValue]
}