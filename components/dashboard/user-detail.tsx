'use client'

import React, {SVGProps} from "react";
import Image from "next/image";
import {UserWithDetail} from "@/types/auth-types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {AlertCircle, Calendar, Mail, Phone, User} from "lucide-react";
import {Separator} from "@/components/ui/separator";

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
);

export function UserDetail({user}: {user: UserWithDetail}) {
  const initials = user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="w-full">
        <CardContent className="px-6 pb-6 pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="size-24 border-2 border-gray-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-gray-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="size-3" />
                  User
                </Badge>
                {user.emailVerified && (
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5 text-blue-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                Phone
              </div>
              <span className="font-medium">
                {user.detail?.phoneNumber || "Not provided"}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                Email
              </div>
              <span className="font-medium">{user.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-red-500" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                Contact Name
              </div>
              <span className="font-medium">
                {user.detail?.emergencyContactName || "Not provided"}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                Contact Phone
              </div>
              <span className="font-medium">
                {user.detail?.emergencyContactNumber || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Card */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {user.detail?.instagram && user.detail.instagram.trim() !== "" && (
              <InstagramIcon className="size-6 text-gray-600" />
            )}
            {user.detail?.strava && user.detail.strava.trim() !== "" && (
              <Image
                src="/strava.svg"
                alt="Strava"
                width={24}
                height={24}
                className="size-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-green-500" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                Member Since
              </div>
              <span className="font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                Account Status
              </div>
              <Badge variant={user.banExpires ? "destructive" : "default"}>
                {user.banExpires ? "Banned" : "Active"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}