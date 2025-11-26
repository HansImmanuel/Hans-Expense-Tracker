import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <div className='p-5 flex justify-center items-center my-6'>
           <SignUp 
              forceRedirectUrl='/dashboard'
           /> 
         </div>
}