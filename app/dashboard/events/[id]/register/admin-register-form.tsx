'use client'

import {useState} from "react";
import {EventCategoryType, EventGroupType} from "@/db/schema";
import {PromoType} from "@/db/schema/event-promo.schema";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Item, ItemContent} from "@/components/ui/item";
import {Separator} from "@/components/ui/separator";
import {formatMoney} from "@/utils/money-helper";

const JERSEY_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

type Props = {
  categories: EventCategoryType[]
  groups: EventGroupType[]
  promos: PromoType[]
}

export function AdminRegisterForm({categories, groups, promos}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [jerseySize, setJerseySize] = useState<string>('')
  const [promoId, setPromoId] = useState<string>('')

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

  const canSubmit = name.trim() !== '' && email.trim() !== '' && categoryId !== ''

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* LEFT: Form */}
      <Card>
        <CardHeader>
          <CardTitle>Participant Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={v => { setCategoryId(v ?? ''); setPromoId('') }}>
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
            <Select value={groupId} onValueChange={v => setGroupId(v ?? '')}>
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
            <Select value={jerseySize} onValueChange={v => setJerseySize(v ?? '')}>
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

          {promos.length > 0 && (
            <div className="space-y-1.5">
              <Label>
                Promo{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Select value={promoId} onValueChange={v => setPromoId(v ?? '')}>
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
        <CardFooter>
          <Button className="w-full" disabled={!canSubmit}>
            Register & Get Payment Link
          </Button>
        </CardFooter>
      </Card>

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

          {(selectedGroup || jerseySize) && (
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
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}
