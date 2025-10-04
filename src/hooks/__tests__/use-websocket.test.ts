import { useWebsocket } from '../use-websocket'
import { act, renderHook } from '@testing-library/react-native'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('useWebsocket', () => {
  test('should be defined', () => {
    expect(true).toBe(true)
  })
})

// Mock WebSocket
class MockWebSocket {
  public static CONNECTING = 0
  public static OPEN = 1
  public static CLOSING = 2
  public static CLOSED = 3

  public readyState = MockWebSocket.CONNECTING
  public url: string
  public onopen: ((event: Event) => void) | null = null
  public onmessage: ((event: MessageEvent) => void) | null = null
  public onerror: ((event: Event) => void) | null = null
  public onclose: ((event: CloseEvent) => void) | null = null

  private eventListeners: { [key: string]: Function[] } = {
    open: [],
    message: [],
    error: [],
    close: [],
  }

  constructor(url: string) {
    this.url = url
    // Simulate async connection
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN
      this.triggerEvent('open', new Event('open'))
    }, 0)
  }

  addEventListener(type: string, listener: Function) {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = []
    }
    this.eventListeners[type].push(listener)
  }

  removeEventListener(type: string, listener: Function) {
    if (this.eventListeners[type]) {
      this.eventListeners[type] = this.eventListeners[type].filter(
        l => l !== listener,
      )
    }
  }

  triggerEvent(type: string, event: Event | MessageEvent | CloseEvent) {
    if (this.eventListeners[type]) {
      this.eventListeners[type].forEach(listener => listener(event))
    }
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open')
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED
    this.triggerEvent('close', new CloseEvent('close', { code: 1000 }))
  }

  simulateError() {
    this.readyState = MockWebSocket.CLOSED
    this.triggerEvent('error', new Event('error'))
  }

  simulateClose(code: number = 1000) {
    this.readyState = MockWebSocket.CLOSED
    this.triggerEvent('close', new CloseEvent('close', { code }))
  }

  simulateMessage(data: string) {
    this.triggerEvent('message', new MessageEvent('message', { data }))
  }
}

// Global mock
const mockWebSocket = MockWebSocket as any
global.WebSocket = mockWebSocket

describe('useWebsocket', () => {
  const testUrl = 'ws://localhost:8080'
  let mockWs: MockWebSocket

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should initialize with connecting state', () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    expect(result.current.isConnecting).toBe(true)
    expect(result.current.isConnected).toBe(false)
    expect(result.current.error).toBe(null)
  })

  test('should connect successfully', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.isConnected).toBe(true)
    expect(result.current.error).toBe(null)
  })

  test('should handle connection errors', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for initial connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Get the mock WebSocket instance
    mockWs = new MockWebSocket(testUrl)

    // Simulate error
    await act(async () => {
      mockWs.simulateError()
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.isConnected).toBe(false)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('WebSocket connection error')
  })

  test('should send messages when connected', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const sendSpy = vi.spyOn(mockWs, 'send')

    act(() => {
      result.current.send('test message')
    })

    expect(sendSpy).toHaveBeenCalledWith('test message')
  })

  test('should queue messages when not connected', () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Send message before connection
    act(() => {
      result.current.send('queued message')
    })

    // Should not throw error, message should be queued
    expect(result.current.isConnecting).toBe(true)
  })

  test('should flush queued messages after connection', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Send message before connection
    act(() => {
      result.current.send('queued message')
    })

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const sendSpy = vi.spyOn(mockWs, 'send')

    // Trigger a state update to flush queue
    act(() => {
      result.current.send('new message')
    })

    expect(sendSpy).toHaveBeenCalledWith('queued message')
    expect(sendSpy).toHaveBeenCalledWith('new message')
  })

  test('should handle incoming messages', async () => {
    const onMessage = vi.fn()
    renderHook(() => useWebsocket(testUrl, onMessage))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Simulate incoming message
    await act(async () => {
      mockWs.simulateMessage('test message')
    })

    expect(onMessage).toHaveBeenCalledWith('test message')
  })

  test('should handle connection close with normal code', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Simulate normal close
    await act(async () => {
      mockWs.simulateClose(1000)
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.isConnected).toBe(false)
  })

  test('should attempt reconnection on abnormal close', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for initial connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Simulate abnormal close
    await act(async () => {
      mockWs.simulateClose(1001)
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.isConnected).toBe(false)

    // Fast forward time to trigger reconnection
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Should attempt to reconnect
    expect(result.current.isConnecting).toBe(true)
  })

  test('should implement exponential backoff for reconnection', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for initial connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Simulate multiple connection failures
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        mockWs.simulateClose(1001)
      })

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(1000 * Math.pow(2, i))
      })

      // Wait for reconnection attempt
      await act(async () => {
        vi.advanceTimersByTime(0)
      })
    }

    expect(result.current.isConnecting).toBe(true)
  })

  test('should handle disconnect', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Disconnect
    act(() => {
      result.current.disconnect()
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.isConnected).toBe(false)
  })

  test('should cleanup on unmount', async () => {
    const { result, unmount } = renderHook(() => useWebsocket(testUrl))

    // Wait for connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isConnected).toBe(true)

    // Unmount
    unmount()

    // Connection should be cleaned up
    expect(result.current.isConnected).toBe(false)
  })

  test('should reset reconnection attempts on successful connection', async () => {
    const { result } = renderHook(() => useWebsocket(testUrl))

    // Wait for initial connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Simulate connection failure and reconnection
    await act(async () => {
      mockWs.simulateClose(1001)
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Wait for reconnection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Should be connected again
    expect(result.current.isConnected).toBe(true)
    expect(result.current.isConnecting).toBe(false)
  })

  test('should handle URL changes', async () => {
    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useWebsocket(url),
      { initialProps: { url: testUrl } },
    )

    // Wait for initial connection
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isConnected).toBe(true)

    // Change URL
    rerender({ url: 'ws://localhost:9090' })

    // Should reconnect with new URL
    expect(result.current.isConnecting).toBe(true)
  })
})
