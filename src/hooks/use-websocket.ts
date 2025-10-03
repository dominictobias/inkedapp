import { useCallback, useEffect, useRef, useState } from 'react'

export function useWebsocket(
  url: string,
  onMessage?: (message: string) => void,
) {
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const baseReconnectDelayMsRef = useRef(1000)
  const maxReconnectDelayMsRef = useRef(30000)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageQueueRef = useRef<string[]>([])
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(() => {
    socketRef.current = new WebSocket(url)

    const tryConnect = () => {
      if (reconnectTimerRef.current) return

      const attempt = reconnectAttemptsRef.current
      const exponentialDelay =
        baseReconnectDelayMsRef.current * Math.pow(2, attempt)
      const cappedDelay = Math.min(
        exponentialDelay,
        maxReconnectDelayMsRef.current,
      )
      const jitter = Math.random() * 0.2 * cappedDelay
      const delayMs = Math.floor(cappedDelay + jitter)

      reconnectAttemptsRef.current += 1

      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null
        try {
          connect()
        } catch {
          tryConnect()
        }
      }, delayMs)
    }

    const flushQueue = () => {
      while (
        messageQueueRef.current.length > 0 &&
        socketRef.current?.readyState === WebSocket.OPEN
      ) {
        const message = messageQueueRef.current.shift()
        if (message) {
          socketRef.current.send(message)
        }
      }
    }

    socketRef.current.addEventListener('open', (e: Event) => {
      reconnectAttemptsRef.current = 0
      setIsConnecting(false)
      setIsConnected(true)
      setError(null)
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      flushQueue()
    })

    socketRef.current.addEventListener('message', (event: MessageEvent) => {
      onMessageRef.current?.(event.data)
    })

    socketRef.current.addEventListener('error', (event: Event) => {
      setError(new Error('WebSocket connection error'))
      setIsConnecting(false)
      setIsConnected(false)
    })

    socketRef.current.addEventListener('close', (e: CloseEvent) => {
      setIsConnecting(false)
      setIsConnected(false)
      if (e.code > 1000) {
        tryConnect()
      }
    })
  }, [url])

  const send = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message)
    } else {
      messageQueueRef.current.push(message)
    }
  }

  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    reconnectAttemptsRef.current = 0
    setIsConnecting(false)
    setIsConnected(false)
    socketRef.current?.close()
  }

  useEffect(() => {
    setIsConnecting(true)
    connect()

    return () => {
      disconnect()
    }
  }, [connect])

  return {
    isConnecting,
    isConnected,
    error,
    send,
    disconnect,
  }
}
