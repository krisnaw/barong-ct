import {StepPayment} from "@/components/checkout/step-payment";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;


  return (
    <div>
      <StepPayment   />
    </div>
  )
}