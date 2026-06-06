'use client'

import {useActionState, useState} from "react";
import {EventCategoryType, EventGroupType} from "@/db/schema";
import {PromoType} from "@/db/schema/event-promo.schema";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Item, ItemContent} from "@/components/ui/item";
import {Separator} from "@/components/ui/separator";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldContent, FieldDescription, FieldLabel, FieldTitle} from "@/components/ui/field";
import {formatMoney} from "@/utils/money-helper";
import {adminRegisterParticipant, AdminRegisterState} from "@/app/actions/event-participant/event-participant.action";
import {toast} from "sonner";

const JERSEY_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const GENDERS = ['Male', 'Female', 'Other']
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const PAYMENT_METHODS = [
  {
    id: 'pm-bni-va',
    value: ['VIRTUAL_ACCOUNT_BNI'],
    label: 'BNI Virtual Account',
    description: 'Pay with BNI VA',
  },
  {
    id: 'pm-qris-cc',
    value: ['QRIS', 'CREDIT_CARD'],
    label: 'QRIS / Credit Card',
    description: 'Pay with QRIS or Credit Card',
  },
]

type Props = {
  eventId: number
  categories: EventCategoryType[]
  groups: EventGroupType[]
  promos: PromoType[]
}

export function AdminRegisterForm({eventId, categories, groups, promos}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [jerseySize, setJerseySize] = useState<string>('')
  const [promoId, setPromoId] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [bloodType, setBloodType] = useState<string>('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [pm, setPm] = useState<string[]>([])

  const selectedCategory = categories.find(c => String(c.id) === categoryId)
  const selectedGroup = groups.find(g => String(g.id) === groupId)
  const selectedPromo = promos.find(p => String(p.id) === promoId)

  const price = Number(selectedCategory?.price ?? 0)
  const fee = Number(selectedCategory?.serviceFee ?? 0)

  const discount = selectedPromo
    ? selectedPromo.discountType === 'percentage'
      ? price * (selectedPromo.discountValue / 100)
      : selectedPromo.discountValue
    : 0

  const isFreePass = discount >= price
  const total = isFreePass ? 0 : price + fee - discount

  const [state, dispatch, isPending] = useActionState<AdminRegisterState, FormData>(
    async (prev, formData) => {
      const result = await adminRegisterParticipant(prev, formData)
      if (result?.success === false) {
        toast.error(result.message)
      }
      return result
    },
    null
  )

  const canSubmit = name.trim() !== '' && email.trim() !== '' && categoryId !== '' && pm.length > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* LEFT: Form */}
      <form action={dispatch}>
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="pm" value={JSON.stringify(pm)} />
        <Card>
          <CardHeader>
            <CardTitle>Participant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone Number{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +62812345678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select name="categoryId" value={categoryId} onValueChange={v => {
                setCategoryId(v ?? '');
                setPromoId('')
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category"/>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name} — {formatMoney(Number(cat.price))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Group{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Select name="groupId" value={groupId} onValueChange={v => setGroupId(v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select group"/>
                </SelectTrigger>
                <SelectContent>
                  {groups.map(g => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Jersey Size{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Select name="jerseySize" value={jerseySize} onValueChange={v => setJerseySize(v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size"/>
                </SelectTrigger>
                <SelectContent>
                  {JERSEY_SIZES.map(size => (
                    <SelectItem key={size} value={size.toLowerCase()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Gender{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Select name="gender" value={gender} onValueChange={v => setGender(v ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender"/>
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map(g => (
                      <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Blood Type{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Select name="bloodType" value={bloodType} onValueChange={v => setBloodType(v ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blood type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map(bt => (
                      <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">
                City{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="e.g. Denpasar"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergency-name">
                Emergency Contact Name{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="emergency-name"
                name="emergencyContactName"
                placeholder="e.g. Jane Doe"
                value={emergencyContactName}
                onChange={e => setEmergencyContactName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergency-phone">
                Emergency Phone{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="emergency-phone"
                name="emergencyPhone"
                type="tel"
                placeholder="e.g. +62812345678"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup
              value={pm}
              onValueChange={(value: string[]) => setPm(value)}
              className="grid grid-cols-1 gap-2"
            >
              {PAYMENT_METHODS.map(method => (
                <FieldLabel htmlFor={method.id} key={method.id}>
                  <Field orientation="horizontal" className="pb-2.5">
                    <RadioGroupItem value={method.value} id={method.id} />
                    <FieldContent>
                      <FieldTitle>{method.label}</FieldTitle>
                      <FieldDescription>{method.description}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </div>

          {promos.length > 0 && (
              <div className="space-y-1.5">
                <Label>
                  Promo{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Select name="promoId" value={promoId} onValueChange={v => setPromoId(v ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select promo"/>
                  </SelectTrigger>
                  <SelectContent>
                    {promos.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.promo} —{" "}
                        {p.discountType === 'percentage'
                          ? `${p.discountValue}% off`
                          : formatMoney(p.discountValue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex-col gap-3">
            {state?.success && state.paymentUrl ? (
              <div className="w-full space-y-2">
                <div className="flex gap-2">
                  <Input readOnly value={state.paymentUrl} className="font-mono text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(state.paymentUrl!)
                      toast.success('Payment link copied!')
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Share this link with the participant to complete payment.
                </p>
              </div>
            ) : (
              <Button type="submit" className="w-full" disabled={!canSubmit || isPending}>
                {isPending ? 'Submitting…' : 'Register & Get Payment Link'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>

      {/* RIGHT: Live preview */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div>
            <p className="font-medium">
              {name || <span className="text-muted-foreground">Full name</span>}
            </p>
            <p className="text-sm text-muted-foreground">
              {email || 'email@example.com'}
            </p>
          </div>

          <Separator/>

          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedCategory ? selectedCategory.name : 'No category selected'}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {selectedCategory ? formatMoney(price) : '—'}
                </span>
              </div>

              {!isFreePass && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Service fee</span>
                  <span className="text-sm font-medium tabular-nums">
                    {selectedCategory ? formatMoney(fee) : '—'}
                  </span>
                </div>
              )}

              {selectedPromo && discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">
                    Promo ({selectedPromo.promo})
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-green-600">
                    -{formatMoney(discount)}
                  </span>
                </div>
              )}

              <Separator/>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-semibold tabular-nums">
                  {selectedCategory ? formatMoney(total) : '—'}
                </span>
              </div>
            </ItemContent>
          </Item>

          {(selectedGroup || jerseySize || gender || bloodType || city || emergencyContactName || emergencyPhone) && (
            <div className="flex flex-wrap gap-2">
              {selectedGroup && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {selectedGroup.name}
                </span>
              )}
              {jerseySize && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground uppercase">
                  {jerseySize}
                </span>
              )}
              {gender && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground capitalize">
                  {gender}
                </span>
              )}
              {bloodType && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {bloodType}
                </span>
              )}
              {city && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {city}
                </span>
              )}
              {emergencyContactName && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  Emergency: {emergencyContactName}{emergencyPhone ? ` · ${emergencyPhone}` : ''}
                </span>
              )}
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}
