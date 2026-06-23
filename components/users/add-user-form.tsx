'use client'

import * as React from "react"
import {useActionState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {toast} from "sonner"

import {createDashboardUserAction} from "@/app/actions/dashboard-user/dashboard-user.action"
import {Button, buttonVariants} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {ActionResponse, initialState} from "@/types/types"

type AddUserFields = {
  name: string
  email: string
}

const initialAddUserState: ActionResponse<unknown, AddUserFields> = initialState

export function AddUserForm() {
  const router = useRouter()
  const formId = React.useId()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")

  const [, formAction, isPending] = useActionState(async (_: ActionResponse<unknown, AddUserFields>, formData: FormData) => {
    const res = await createDashboardUserAction({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
    })

    if (res.success) {
      toast.success(res.message)
      router.push("/dashboard/users")
    } else {
      toast.error(res.message)
    }

    return res
  }, initialAddUserState)

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <CardDescription>
          Create a user account with a name and email address.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id={formId} action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
              <Input
                id={`${formId}-name`}
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="made@example.com"
                autoComplete="email"
                required
              />
              <FieldDescription>
                The user can sign in later with the same email address.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Link href="/dashboard/users" className={buttonVariants({variant: "outline"})}>
          Cancel
        </Link>
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? <Spinner /> : null}
          Create User
        </Button>
      </CardFooter>
    </Card>
  )
}
