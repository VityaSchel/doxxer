export function Network({ ipv4, ipv6, hostname, asn, cidr, ispAddress, ispContact, udpOpenPorts, tcpOpenPorts }: {
  ipv4: string
  ipv6: string
  hostname: string
  asn: string
  cidr: string
  ispAddress: string
  ispContact: string
  udpOpenPorts: string[]
  tcpOpenPorts: string[]
}) {
  return (
    <div className='fixed top-0 left-0 font-bk text-[#512716] flex flex-col 1096:flex-row justify-evenly items-center w-full h-full'>
      <svg xmlns="http://www.w3.org/2000/svg" className='w-[50vw] h-[50vw] 1096:w-[30vw] 1096:h-[30vw]' viewBox="0 0 24 24"><path fill="#61B0B1" d="M12 14.5q1.13 0 2.073-.514q.943-.515 1.554-1.37q-.779-.552-1.696-.834T12 11.5t-1.93.282t-1.697.834q.612.855 1.554 1.37q.942.514 2.073.514m0-5q.633 0 1.066-.434Q13.5 8.633 13.5 8t-.434-1.066Q12.633 6.5 12 6.5t-1.066.434T10.5 8t.434 1.066Q11.367 9.5 12 9.5m0 11.52q-3.525-3.118-5.31-5.815q-1.786-2.697-1.786-4.909q0-3.173 2.066-5.234Q9.037 3 12 3t5.03 2.062q2.066 2.061 2.066 5.234q0 2.212-1.785 4.909q-1.786 2.697-5.311 5.814"></path></svg>
      <div className='flex flex-col items-center text-center 1096:text-right 1096:items-end text-xl 1096:text-[6vh] 1096:leading-[8vh] reveal'>
        <span className='text-[#F7C96B]'>IPV4: {ipv4}</span>
        {ipv6 && <span className='text-[#D94D25]'>IPV6: {ipv6}</span>}
        <span>{hostname}</span>
        <span className='text-[#B23927]'>ISP: {asn}</span>
        <span>CIDR: {cidr}</span>
        <span>ISP ADDRESS: {ispAddress}</span>
        <span>ISP CONTACT: {ispContact}</span>
        <span>DNS: 8.8.8.8</span>
        <span className='text-[#EF9D4B]'>UDP OPEN PORTS: {udpOpenPorts.slice(0, 5).join(', ')}</span>
        <span className='text-[#EF9D4B]'>TCP OPEN PORTS: {tcpOpenPorts.slice(0, 5).join(', ')}</span>
      </div>
    </div>
  )
}