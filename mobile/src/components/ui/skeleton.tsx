import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, useColorScheme, View, type LayoutChangeEvent } from 'react-native'
import { cn } from '@/lib/utils'

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function Skeleton({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const shimmer = useRef(new Animated.Value(-1)).current
  const shimmerDuration = useRef(randomBetween(1300, 1700)).current
  const shimmerDelay = useRef(randomBetween(0, 500)).current
  const [width, setWidth] = useState(0)
  const scheme = useColorScheme()

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: shimmerDuration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    )

    const timeout = setTimeout(() => animation.start(), shimmerDelay)

    return () => {
      clearTimeout(timeout)
      animation.stop()
    }
  }, [shimmer, shimmerDelay, shimmerDuration])

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width)
    props.onLayout?.(event)
  }

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width]
  })

  return (
    <View className={cn('relative overflow-hidden rounded-md bg-primary/5', className)} {...props} onLayout={onLayout}>
      {width > 0 && (
        <Animated.View
          pointerEvents='none'
          style={[
            styles.shimmer,
            {
              experimental_backgroundImage:
                scheme === 'dark'
                  ? 'linear-gradient(90deg, transparent 0%, #ffffff0d 50%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, #00000014 50%, transparent 100%)',
              transform: [{ translateX }]
            }
          ]}
        />
      )}
    </View>
  )
}

export { Skeleton }

const styles = StyleSheet.create({
  shimmer: {
    ...StyleSheet.absoluteFill
  }
})