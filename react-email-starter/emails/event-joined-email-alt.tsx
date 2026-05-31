import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import * as React from "react";

const imgURL = "https://www.barongmelali.com/barong-no-bg.png"

interface EmailProps {
  name: string,
  eventName: string,
  eventDate: string,
  eventTime: string,
  meetingPoint: string,
  eventURL: string,
  inviteURL?: string,
  bibNumber?: string,
  jerseySize?: string,
  category?: string
}

export const EventJoinedEmailAlt = ({
  name,
  eventName,
  eventDate,
  eventTime,
  meetingPoint,
  eventURL,
  inviteURL,
  bibNumber,
  jerseySize,
  category,
}: EmailProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuB6w.woff2",
          format: "woff2",
        }}
        fontWeight={600}
        fontStyle="normal"
      />
    </Head>
    <Tailwind>
      <Body className="bg-[#f4f4f5] font-sans m-0 p-0">
        <Preview>You&#39;re in! Your spot for {eventName} is confirmed.</Preview>

        <Container className="mx-auto max-w-[560px] py-8">

          {/* Dark header */}
          <Section style={{ backgroundColor: '#18181b', borderRadius: '16px 16px 0 0' }} className="px-8 pt-6 pb-2">
            <Row>
              <Column>
                <Text className="m-0 text-[11px] font-semibold uppercase tracking-widest text-[#E86A1F]">
                  Registration Confirmed
                </Text>
                <Text className="m-0 text-[20px] font-bold leading-tight text-white">
                  {eventName}
                </Text>
              </Column>
              <Column className="w-16" align="right">
                <Img
                  src={imgURL}
                  width="56"
                  height="56"
                  alt="Barong"
                  style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                  className="rounded-xl"
                />
              </Column>
            </Row>
          </Section>

          {/* Event details row */}
          <Section style={{ backgroundColor: '#18181b' }} className="px-8 pt-3 pb-2">
            <Row>
              <Column className="w-1/2 pr-4">
                <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Date
                </Text>
                <Text className="m-0 text-[13px] font-semibold text-white">
                  {eventDate}
                </Text>
              </Column>
              <Column className="w-1/2">
                <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Time
                </Text>
                <Text className="m-0 text-[13px] font-semibold text-white">
                  {eventTime}
                </Text>
              </Column>
            </Row>
          </Section>
          <Section style={{ backgroundColor: '#18181b' }} className="px-8 pt-2 pb-6">
            <Row>
              <Column>
                <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Meeting Point
                </Text>
                <Text className="m-0 text-[13px] font-semibold text-white">
                  {meetingPoint}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Greeting */}
          <Section style={{ backgroundColor: '#ffffff' }} className="px-8 pt-6 pb-2">
            <Text className="m-0 text-[16px] font-semibold text-[#18181b]">
              You&#39;re in, {name}! 🎉
            </Text>
            <Text className="m-0 text-[13px] text-[#71717a]">
              Saddle up — your spot is confirmed.
            </Text>
          </Section>

          {/* Stat blocks */}
          {(bibNumber || jerseySize || category) && (
            <Section style={{ backgroundColor: '#ffffff' }} className="px-8 pb-6 pt-2">
              <Row>
                {bibNumber && (
                  <Column className="w-1/3 pr-2">
                    <Section style={{ backgroundColor: '#f4f4f5', borderRadius: '12px' }} className="px-4 py-4 text-center">
                      <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                        Bib
                      </Text>
                      <Text className="m-0 mt-1 text-[22px] font-bold text-[#18181b]">
                        {bibNumber}
                      </Text>
                    </Section>
                  </Column>
                )}
                {jerseySize && (
                  <Column className="w-1/3 px-1">
                    <Section style={{ backgroundColor: '#f4f4f5', borderRadius: '12px' }} className="px-4 py-4 text-center">
                      <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                        Jersey
                      </Text>
                      <Text className="m-0 mt-1 text-[22px] font-bold uppercase text-[#18181b]">
                        {jerseySize}
                      </Text>
                    </Section>
                  </Column>
                )}
                {category && (
                  <Column className="w-1/3 pl-2">
                    <Section style={{ backgroundColor: '#f4f4f5', borderRadius: '12px' }} className="px-4 py-4 text-center">
                      <Text className="m-0 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                        Category
                      </Text>
                      <Text className="m-0 mt-1 text-[22px] font-bold text-[#18181b]">
                        {category}
                      </Text>
                    </Section>
                  </Column>
                )}
              </Row>
            </Section>
          )}

          {/* CTA */}
          <Section style={{ backgroundColor: '#ffffff' }} className="px-8 pb-6">
            <Button
              className="block w-full rounded-xl bg-[#E86A1F] py-3 text-center text-[14px] font-semibold text-white no-underline"
              href={eventURL}
            >
              View Event →
            </Button>
          </Section>

          {/* Invite / share section */}
          {inviteURL && (
            <Section style={{ backgroundColor: '#ffffff', borderRadius: '0 0 16px 16px' }} className="px-8 pb-8">
              <Section style={{ backgroundColor: '#fff7ed', borderRadius: '12px', borderLeft: '3px solid #E86A1F' }} className="px-5 py-5">
                <Text className="m-0 text-[13px] font-semibold text-[#18181b]">
                  🚴 Riding solo? Invite your crew.
                </Text>
                <Text className="m-0 mt-1 text-[13px] leading-6 text-[#71717a]">
                  This event requires riding in a group. Share this link with your friends so they can register and join your group ride:
                </Text>
                <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} className="mt-3 px-4 py-3">
                  <Link
                    href={inviteURL}
                    className="text-[12px] text-[#E86A1F] no-underline break-all"
                  >
                    {inviteURL}
                  </Link>
                </Section>
              </Section>
            </Section>
          )}

          {/* Footer note */}
          <Section className="px-4 pt-6">
            <Text className="m-0 text-center text-[12px] text-[#a1a1aa]">
              Don&#39;t forget your helmet, water bottle, and good vibes.
            </Text>
            <Text className="m-0 mt-1 text-center text-[12px] text-[#a1a1aa]">
              See you at the starting line — <strong>Barong Cycling Team</strong>
            </Text>
          </Section>

        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EventJoinedEmailAlt.PreviewProps = {
  name: "Krisna",
  eventName: "Jakarta Morning Ride",
  eventDate: "January 25, 2026",
  eventTime: "06:00 AM",
  meetingPoint: "Monas, Central Jakarta",
  eventURL: "https://barong.cc/event/1",
  inviteURL: "https://barong.cc/event/1?ref=invite",
  bibNumber: "002",
  jerseySize: "L",
  category: "Long",
} satisfies EmailProps;

export default EventJoinedEmailAlt;