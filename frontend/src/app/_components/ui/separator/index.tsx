import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function Separator({className}: {className?: string}) {
  return (
    <div className={twMerge('border-t', className)} />
  )
}
