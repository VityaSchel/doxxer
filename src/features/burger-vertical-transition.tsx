import cx from 'classnames'

export function BurgerVerticalTransition({ visible }: {
  visible: boolean
}) {
  return (
    <div className={cx('flex flex-col w-full h-full [&>div]:h-[12.5vh] [&>div]:w-full fixed top-0 left-0 transition-transform duration-700 ease-linear', {
      'translate-x-full': !visible,
      '-translate-x-full': visible
    })}>
      <div className='bg-[#40201A] w-full' />
      <div className='bg-[#522818] w-full' />
      <div className='bg-[#B53A25] w-full' />
      <div className='bg-[#D84C23] w-full' />
      <div className='bg-[#F09C4A] w-full' />
      <div className='bg-[#E0A138] w-full' />
      <div className='bg-[#C59E46] w-full' />
      <div className='bg-[#ffffff] w-full' />
    </div>
  )
}