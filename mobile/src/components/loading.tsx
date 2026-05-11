import { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

type Props = {
  width?: number
  height?: number
}

export function Loading({ width = 16, height = 16 }: Props) {
  const rotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true
      })
    )

    animation.start()

    return () => animation.stop()
  }, [rotate])

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return (
    <View className='items-center justify-center'>
      <Animated.View
        style={{
          width,
          height,
          borderRadius: Math.min(width, height) / 2,
          borderWidth: 3,
          borderColor: '#d1d5db',
          borderTopColor: '#3b82f6',
          transform: [{ rotate: spin }]
        }}
      />
    </View>
  )
}