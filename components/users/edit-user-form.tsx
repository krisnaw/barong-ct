"use client"

import * as React from "react"
import {useActionState} from "react"
import {toast} from "sonner"

import {updateDashboardUserAction} from "@/app/actions/dashboard-user/dashboard-user.action"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {UserType} from "@/db/schema/auth-schema"
import {ActionResponse, initialState} from "@/types/types"

type EditUserFields = { id: string; name: string; email: string }

export function EditUserForm({user}: { user: UserType }) {
  const formId = React.useId()

  const [, formAction, isPending] = useActionState(
    async (_: ActionResponse<unknown, EditUserFields>, formData: FormData) => {
      const res = await updateDashboardUserAction({
        id: String(formData.get("id") ?? ""),
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
      })

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }

      return res
    },
    initialState as ActionResponse<unknown, EditUserFields>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>
          Manage the user name and email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={formId} action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={user.id} />

          <FieldGroup className="grid gap-5 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
              <Input
                id={`${formId}-name`}
                name="name"
                type="text"
                defaultValue={user.name}
                placeholder="Made Wijaya"
                autoComplete="name"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="made@example.com"
                autoComplete="email"
                required
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? <Spinner /> : null}
          Save Account
        </Button>
      </CardFooter>
    </Card>
  )
}