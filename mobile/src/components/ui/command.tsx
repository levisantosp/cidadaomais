import { Search } from 'lucide-react-native'
import { Platform, Pressable, ScrollView, TextInput, View } from 'react-native'
import { Separator } from '@/components/ui/separator'
import { Text, TextClassContext } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

function Command({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return (
    <TextClassContext.Provider value='text-popover-foreground'>
      <View
        className={cn('bg-popover border-border flex flex-col overflow-hidden rounded-md border', className)}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  const theme = useTheme()

  return (
    <View className='border-border flex-row items-center gap-2 border-b px-3'>
      <Search color={theme.textSecondary} size={16} />
      <TextInput
        className={cn(
          'text-foreground h-11 flex-1 text-sm',
          props.editable === false &&
            cn('opacity-50', Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })),
          Platform.select({
            web: 'placeholder:text-muted-foreground outline-none',
            native: 'placeholder:text-muted-foreground/50'
          }),
          className
        )}
        autoCapitalize='none'
        autoCorrect={false}
        {...props}
      />
    </View>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof ScrollView> & React.RefAttributes<ScrollView>) {
  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      className={cn('max-h-72', className)}
      contentContainerClassName='p-1'
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return <Text className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props} />
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    heading?: string
  }) {
  return (
    <View className={cn('gap-1 p-1', className)} {...props}>
      {heading ? <Text className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>{heading}</Text> : null}
      {children}
    </View>
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator> & React.RefAttributes<typeof Separator>) {
  return <Separator className={cn('-mx-1 my-1', className)} {...props} />
}

function CommandItem({
  className,
  disabled,
  value,
  onPress,
  onSelect,
  ...props
}: React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> & {
    value?: string
    onSelect?: (value: string) => void
  }) {
  return (
    <TextClassContext.Provider value={cn('text-sm', disabled && 'text-muted-foreground')}>
      <Pressable
        role='button'
        disabled={disabled}
        onPress={(event) => {
          onPress?.(event)
          onSelect?.(value ?? '')
        }}
        className={cn(
          'min-h-10 flex-row items-center gap-2 rounded-sm px-2 py-2 active:bg-accent',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return <Text className={cn('ml-auto text-xs text-muted-foreground', className)} {...props} />
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
}