'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export function StepOrder() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>

          <div>
            <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="">$72.00</dd>
              </div>

              <div className="flex justify-between">
                <dt>Service Fee</dt>
                <dd className="">$8.00</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-primary">
                <dt className="text-base">Total</dt>
                <dd className="text-base">$86.40</dd>
              </div>
            </dl>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}