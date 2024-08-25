import { BurgerVerticalTransition } from '@/features/burger-vertical-transition'

export function Transitions({ burgerTransitionVisible }: {
  burgerTransitionVisible: boolean
}) {

  return (
    <div className='w-full h-full fixed top-0 left-0 z-[100]'>
      <BurgerVerticalTransition visible={burgerTransitionVisible} />
    </div>
  )
}