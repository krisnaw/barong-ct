import {getUserWithDetail} from "@/db/query/user-query";
import {Mail} from "lucide-react";
import {notFound} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {BackButton} from "@/components/button/back-button";
import {cn} from "@/lib/utils";

export default async function UserDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const user = await getUserWithDetail(id);

  if (!user) notFound();

  const initials = user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-4">
      <BackButton href="/dashboard/users">
        Back to Users
      </BackButton>

      {/* Profile hero */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-5">
            <Avatar className="size-20 shrink-0 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h1 className="text-xl font-semibold text-balance">{user.name}</h1>
                <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {user.emailVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                    Email Verified
                  </Badge>
                )}

                {user.detail?.instagram && (
                  <a
                    href={user.detail.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                    aria-label="Instagram"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}

                {user.detail?.strava && (
                  <a
                    href={user.detail.strava}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 px-2 rounded-lg hover:bg-muted transition-colors duration-150"
                    aria-label="Strava"
                  >
                    <Image
                      src="/strava.svg"
                      alt="Strava"
                      width={80}
                      height={20}
                      className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <InfoField label="Nationality" value={user.detail?.nationality} />
            <InfoField label="Birth Date" value={user.detail?.dateOfBirth} />
            <InfoField label="ID Number" value={user.detail?.identityNumber} />
            <InfoField label="Gender" value={user.detail?.gender} />
            <InfoField label="Blood Type" value={user.detail?.bloodType} />
            <InfoField label="Cycling Team / Club" value={user.detail?.clubName} />
          </InfoGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <InfoField label="Email Address" value={user.email} />
            <InfoField label="Phone Number" value={user.detail?.phoneNumber} />
            <InfoField label="Emergency Contact Name" value={user.detail?.emergencyContactName} />
            <InfoField label="Emergency Contact Number" value={user.detail?.emergencyContactNumber} />
          </InfoGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <InfoField label="Country of Residence" value={user.detail?.countryOfResidence} />
            <InfoField label="Province" value={user.detail?.province} />
            <InfoField label="City" value={user.detail?.city} />
            <InfoField label="ZIP / Postal Code" value={user.detail?.postalCode} />
            <InfoField label="Address" value={user.detail?.address} span={2} />
          </InfoGrid>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoGrid({children}: {children: React.ReactNode}) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      {children}
    </dl>
  );
}

function InfoField({label, value, span}: {label: string; value?: string | null; span?: number}) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : "sm:col-span-1"}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={cn("mt-1 text-sm font-medium text-pretty", value ? "text-foreground" : "text-muted-foreground")}>
        {value ?? "—"}
      </dd>
    </div>
  );
}
