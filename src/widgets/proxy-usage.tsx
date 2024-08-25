import React from 'react'
import cx from 'classnames'

export function ProxyUsage({ vpn, tor, proxy, proxyService }: {
  vpn: boolean
  tor: boolean
  proxy: boolean
  proxyService: string
}) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 100)
  }, [])
  
  return (
    <div className={cx('flex flex-col gap-2 text-center items-center justify-center h-full text-[10vh] font-bold font-bk transition-transform ease-linear duration-500', {
      'translate-y-full': !visible,
      'translate-y-0': visible
    })}>
      <span className='flex gap-[5vh] items-center text-[#F7C96B]'>VPN {vpn
        ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-3.235-11.883c-.796 0-1.406-.351-2.085-1.148l-6.75-8.344c-.352-.445-.563-1.008-.563-1.523c0-1.102.867-1.945 1.898-1.945c.68 0 1.243.257 1.805.984l5.602 7.242l10.898-17.46c.446-.727 1.055-1.079 1.664-1.079c1.032 0 2.04.68 2.04 1.805c0 .515-.305 1.078-.61 1.547L26.758 38.875c-.516.773-1.172 1.148-1.992 1.148"></path></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="m8.746 8l3.1-3.1a.527.527 0 1 0-.746-.746L8 7.254l-3.1-3.1a.527.527 0 1 0-.746.746l3.1 3.1l-3.1 3.1a.527.527 0 1 0 .746.746l3.1-3.1l3.1 3.1a.527.527 0 1 0 .746-.746zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16"></path></svg>
      }</span>
      <span className='flex gap-[5vh] items-center text-[#B23927]'>Tor {tor
        ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-3.235-11.883c-.796 0-1.406-.351-2.085-1.148l-6.75-8.344c-.352-.445-.563-1.008-.563-1.523c0-1.102.867-1.945 1.898-1.945c.68 0 1.243.257 1.805.984l5.602 7.242l10.898-17.46c.446-.727 1.055-1.079 1.664-1.079c1.032 0 2.04.68 2.04 1.805c0 .515-.305 1.078-.61 1.547L26.758 38.875c-.516.773-1.172 1.148-1.992 1.148"></path></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="m8.746 8l3.1-3.1a.527.527 0 1 0-.746-.746L8 7.254l-3.1-3.1a.527.527 0 1 0-.746.746l3.1 3.1l-3.1 3.1a.527.527 0 1 0 .746.746l3.1-3.1l3.1 3.1a.527.527 0 1 0 .746-.746zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16"></path></svg>
      }</span>
      <span className='flex gap-[5vh] items-center text-[#EF9D4B]'>Proxy {proxy
        ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-3.235-11.883c-.796 0-1.406-.351-2.085-1.148l-6.75-8.344c-.352-.445-.563-1.008-.563-1.523c0-1.102.867-1.945 1.898-1.945c.68 0 1.243.257 1.805.984l5.602 7.242l10.898-17.46c.446-.727 1.055-1.079 1.664-1.079c1.032 0 2.04.68 2.04 1.805c0 .515-.305 1.078-.61 1.547L26.758 38.875c-.516.773-1.172 1.148-1.992 1.148"></path></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="m8.746 8l3.1-3.1a.527.527 0 1 0-.746-.746L8 7.254l-3.1-3.1a.527.527 0 1 0-.746.746l3.1 3.1l-3.1 3.1a.527.527 0 1 0 .746.746l3.1-3.1l3.1 3.1a.527.527 0 1 0 .746-.746zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16"></path></svg>
      }</span>
      {proxyService && <span>{proxyService}</span>}
    </div>
  )
}