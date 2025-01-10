import React from 'react'
import NextStepIcon from '../icons/Next'
import PlayIcon from '../icons/Play'
import FailIcon from '../icons/Fail'
import PotionIcon from '../icons/Potion'
import TestPassIcon from '../icons/TestPass'
import TestFailIcon from '../icons/TestFail'
import ChevronIcon from '../icons/Chevron'
import { Button } from '../ui/button'
export default function AssertToolList() {
  return (
    <div className='flex items-center gap-5'>
    <div className='flex gap-2 pl-4 items-center'>
        <NextStepIcon />
        <PlayIcon />
        <FailIcon />
    </div>
    <div className='flex gap-4 items-center'>
        <PotionIcon />
        <TestPassIcon />
        <TestFailIcon />
    </div>
    <div></div>
    <Button className='!bg-transparent !text-white text-sm !shadow-none'>ADD ASSERTION <ChevronIcon /></Button>
</div>
  )
}
