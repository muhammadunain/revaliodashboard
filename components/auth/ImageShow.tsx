import React from 'react'
import Image from 'next/image'
const ImageShow = () => {
  return (
     <div className="bg-muted relative hidden md:block">
            <Image
              src="/next.svg"
              alt="Image"
              width={50}
              height={50}
              loading='lazy'
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
  )
}

export default ImageShow