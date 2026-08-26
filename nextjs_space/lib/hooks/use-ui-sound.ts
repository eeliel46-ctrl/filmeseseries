'use client'

import { useCallback, useRef, useEffect } from 'react'

export function useUISound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playHoverSound = useCallback(() => {
    try {
      // Initialize AudioContext lazily to avoid auto-play restrictions
      if (typeof window !== 'undefined' && !audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const ctx = audioCtxRef.current
      if (!ctx) return;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      // Create a cinematic UI "tick"
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      // High frequency click that drops rapidly
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08)

      // Envelope: sharp attack, quick decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      // Volume is very quiet (0.05) so it's subtle and not annoying
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01) 
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.08)
    } catch (err) {
      // Ignore errors silently (e.g., if browser blocks audio before user interaction)
    }
  }, [])

  return { playHoverSound }
}
