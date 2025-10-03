import { useCallback, useMemo, useState } from 'react'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlexGroup } from '@/components'
import { colors } from '@/constants/theme'
import { useWebsocket } from '@/hooks/use-websocket'

interface Message {
  id: string
  text: string
  remote: boolean
}

function generatePseudoUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function ChatScreen() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState<Message[]>([])
  const { send, isConnecting, isConnected, error } = useWebsocket(
    'wss://echo.websocket.org',
    message => {
      setConversation(prev => [
        ...prev,
        {
          id: generatePseudoUUID(),
          text: message,
          remote: true,
        },
      ])
    },
  )

  const connectionLabel = useMemo(() => {
    if (isConnecting) return 'Connecting...'
    if (isConnected) return 'Connected'
    return 'Disconnected'
  }, [isConnecting, isConnected])

  const onSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    send(trimmed)
    setConversation(prev => [
      ...prev,
      {
        id: generatePseudoUUID(),
        text: trimmed,
        remote: false,
      },
    ])
    setInput('')
  }, [input, send])

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <FlexGroup
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text style={styles.title}>Chat</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  isConnected ? styles.dotOnline : styles.dotOffline,
                ]}
              />
              <Text style={styles.statusText}>{connectionLabel}</Text>
            </View>
          </FlexGroup>

          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

          <FlatList
            data={conversation}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <View
                  style={[
                    styles.messageRow,
                    item.remote ? styles.messageReceived : styles.messageSent,
                  ]}
                >
                  <Text
                    style={
                      item.remote
                        ? styles.messageTextReceived
                        : styles.messageTextSent
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor={colors.secondaryText}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={onSend}
              returnKeyType="send"
              submitBehavior="blurAndSubmit"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={onSend}
              disabled={!isConnected || !input.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: { backgroundColor: '#22c55e' },
  dotOffline: { backgroundColor: '#ef4444' },
  statusText: { color: '#6b7280' },
  errorText: { color: '#ef4444' },
  messageRow: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    marginBottom: 4,
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#096344',
    color: 'white',
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#2b2f37',
  },
  messageTextReceived: {
    fontSize: 16,
    color: 'white',
  },
  messageTextSent: {
    fontSize: 16,
    color: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    opacity: 1,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
})
