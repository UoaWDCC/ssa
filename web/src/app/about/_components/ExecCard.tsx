import Image from 'next/image'
import { aboutParagraphFont, aboutRoleFont } from './fonts'

interface ExecCardProps {
  name: string
  role: string
  photo: string
}

export default function ExecCard({
  name,
  role,
  photo,
}: Readonly<ExecCardProps>) {
  return (
    <figure
      tabIndex={0}
      className="group relative aspect-square w-full overflow-hidden rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f85b76] xl:rounded-[6px]"
    >
      <Image
        src={photo}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 639px) calc((100vw - 55.35px) / 3), (max-width: 767px) calc((100vw - 84px) / 3), (max-width: 1023px) calc((100vw - 126px) / 4), (max-width: 1279px) calc((100vw - 158px) / 4), (max-width: 1439px) calc((86.3888vw - 516px) / 4), 182px"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[4.554%] from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.9)] xl:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden rounded-[6px] bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 xl:block xl:group-focus:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-end pb-[12px] pl-[12px] pr-[32px] xl:px-[18px] xl:pb-[20px] xl:opacity-0 xl:group-hover:opacity-100 xl:group-focus:opacity-100"
      >
        <div className="flex w-[71.739px] flex-col items-start gap-[4px] xl:w-[113px] xl:gap-[8px]">
          <p
            className={`${aboutParagraphFont.className} w-full text-[14px] font-bold leading-[16px] tracking-[-0.253943px] text-white xl:text-[18px] xl:leading-[22px] xl:tracking-[-0.4px]`}
          >
            {name}
          </p>
          <p
            className={`${aboutRoleFont.className} w-full text-[12px] font-medium uppercase leading-[12px] tracking-[0.48px] text-[#f85b76]`}
          >
            {role}
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden rounded-[6px] border-[1.6px] border-solid border-[#f2ebdd] group-hover:border-[#ff8392] xl:block xl:group-focus:border-[#ff8392]"
      />
      <figcaption className="sr-only">
        {name}, {role}
      </figcaption>
    </figure>
  )
}
