"use client"

import { useEffect } from "react"

export function ThemeStatic() {
  useEffect(() => {
    // Força o tema dark estaticamente
    const html = document.documentElement
    html.classList.add('dark')
    html.setAttribute('data-theme', 'dark')
    html.style.colorScheme = 'dark'
  }, [])

  return null
}
