'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GlobalAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    // Run animations on every route change
    const run = () => {
      // Add sr classes to common elements automatically
      const autoAnimate = [
        { selector: 'h1:not(.no-anim)',     cls: 'sr' },
        { selector: 'h2:not(.no-anim)',     cls: 'sr' },
        { selector: 'h3:not(.no-anim)',     cls: 'sr' },
        { selector: 'p:not(.no-anim)',      cls: 'sr-fade' },
      ]

      // Observe all elements with sr classes
      const els = document.querySelectorAll(
        '.sr, .sr-left, .sr-right, .sr-scale, .sr-fade'
      )

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              // Don't unobserve — keep for re-entry
            }
          })
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -30px 0px',
        }
      )

      els.forEach((el) => io.observe(el))

      // Also handle dynamically added elements
      const mutObs = new MutationObserver(() => {
        document.querySelectorAll(
          '.sr:not([data-observed]), .sr-left:not([data-observed]), .sr-right:not([data-observed]), .sr-scale:not([data-observed]), .sr-fade:not([data-observed])'
        ).forEach((el) => {
          io.observe(el)
          el.setAttribute('data-observed', '1')
        })
      })

      mutObs.observe(document.body, { childList: true, subtree: true })

      return () => {
        io.disconnect()
        mutObs.disconnect()
      }
    }

    // Small delay to let page render
    const timer = setTimeout(run, 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
