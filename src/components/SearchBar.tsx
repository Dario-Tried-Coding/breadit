'use client'

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/Command'
import { usePathname } from '@/lib/next-intl/navigation'
import { trpc } from '@/lib/trpc/trpc'
import { useClickOutside, useDebouncedCallback } from '@mantine/hooks'
import { Subreddit } from '@prisma/client'
import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'

interface SearchBarProps {
  initialSubreddits: Subreddit[]
}

const SearchBar: FC<SearchBarProps> = ({ initialSubreddits }) => {
  const t = useTranslations('Components.SearchBar')

  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  const {
    data: subreddits,
    isFetching,
    refetch,
  } = trpc.searchSubreddit.useQuery({ subredditName: input }, { enabled: false, initialData: initialSubreddits })

  const refetchFn = useDebouncedCallback(async () => refetch(), 300)
  const debouncedRefetchFn = useCallback(() => refetchFn(), [])

  const ref = useClickOutside(() => setIsOpen(false))

  useEffect(() => setInput(''), [pathname])

  return (
    <Command ref={ref} className='h-fit rounded-lg border'>
      <CommandInput
        value={input}
        onValueChange={(value) => {
          setInput(value)
          debouncedRefetchFn()
        }}
        onClick={() => setIsOpen(true)}
        isLoading={isFetching}
        placeholder={t('placeholder')}
        className='h-8'
      />
      <CommandList>
        {!isOpen ? null : subreddits && subreddits?.length > 0 ? (
          subreddits?.map((s) => (
            <CommandItem
              key={s.id}
              value={s.name}
              onSelect={(value) => {
                router.push(`/r/${value}`)
                router.refresh()
                setIsOpen(false)
              }}
            >
              <Users className='h-4 w-4 text-muted-foreground' />
              &nbsp;&nbsp;<span className='text-muted-foreground'>{t('subreddit-prefix')}</span>
              {s.name}
            </CommandItem>
          ))
        ) : (
          <CommandEmpty>{t('empty')}</CommandEmpty>
        )}
      </CommandList>
    </Command>
  )
}

export default SearchBar
