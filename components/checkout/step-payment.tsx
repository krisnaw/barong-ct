'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Field, FieldContent, FieldLabel, FieldTitle} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useQueryState} from "nuqs";
import {useParams, useSearchParams} from "next/navigation";

export function StepPayment() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const eventId = params.id;

  const price = 1000000
  const fee = 25000;
  const total = price + fee;
  const [jerseyGender, setJerseyGender] = useQueryState("gender", { shallow: true});
  const [jerseySize, setJerseySize] = useQueryState("size", {shallow: true});

  // const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async () => {
  //   // const updateOrder = await updateOrder(params);
  //   return {
  //     submitting: true,
  //     message: "",
  //   }
  // }, initialState)


  return (
    <form >
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>

          <RadioGroup onValueChange={(value) => setJerseyGender(value)} defaultValue={jerseyGender || ""} className="grid grid-cols-2">
            {gender.map((item) => (
              <FieldLabel key={item.id} htmlFor={item.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{item.name}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={item.id} id={item.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>

          <RadioGroup onValueChange={(value) => setJerseySize(value)}
                      defaultValue={jerseySize || ""}  className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {sizes.map((size) => (
              <FieldLabel key={size.id} htmlFor={size.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{size.name}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={size.id} id={size.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>



        </CardContent>
        <CardFooter>

          <div className="flex flex-col w-full">
            <div className="w-full">
              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Registration fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(price))}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Service fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(25000))}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(Number(total))}
                  </dd>
                </div>
              </dl>

            </div>

            <div className="mt-6">
              <Button className="w-full" disabled={!(jerseyGender && jerseySize)}>
                Checkout
              </Button>
            </div>
          </div>


        </CardFooter>
      </Card>
    </form>
  )
}

const product =
  {
    id: 1,
    name: 'Jersey Barong Melali 2026',
    href: '#',
    size: 'L',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/confirmation-page-06-product-01.jpg',
    imageAlt: "Model wearing cycling jersey",
  };

const formatMoney = (amount: number, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const gender = [
  {id: "male", name: "Male"},
  {id: "female", name: "Female"},
]
const sizes = [
  {id: 'xxs', name: 'XXS',},
  {id: 'xs', name: 'XS',},
  {id: 's', name: 'S',},
  {id: 'm', name: 'M',},
  {id: 'l', name: 'L',},
  {id: 'xl', name: 'XL',},
  {id: 'xxl', name: 'XXL',},
  {id: 'xxxl', name: 'XXXL',},
  {id: 'xxxxl', name: 'XXXXL',},
];