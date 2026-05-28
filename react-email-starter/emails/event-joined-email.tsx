import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import * as React from "react";

interface EmailProps {
  name: string,
  eventName: string,
  eventDate: string,
  eventTime: string,
  meetingPoint: string,
  eventURL: string,
  bibNumber?: number,
  jerseySize?: string,
  category?: string
}

const imgURL = "https://fi7tj80kxj.ufs.sh/f/jjB2MlHJbriWIPo3tMP916KnsQXzrbZ8jdfDLy0eJwl3qaVC"

export const EventJoinedEmail = ({
                                   name,
                                   eventName,
                                   eventDate,
                                   eventTime,
                                   meetingPoint,
                                   eventURL,
                                   bibNumber,
                                   jerseySize,
                                   category
                                 }: EmailProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
          format: "woff2"
        }}
        fontWeight={400}
        fontStyle="normal"
      />

      <Font
        fontFamily="Inter"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuB6w.woff2", // Medium 500
          format: "woff2",
        }}
        fontWeight={500}
        fontStyle="normal"
      />

      <Font
        fontFamily="Inter"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuB6w.woff2", // Medium 500
          format: "woff2",
        }}
        fontWeight={600}
        fontStyle="normal"
      />
    </Head>
    <Tailwind>
      <Body className="bg-white font-koala">
        <Preview>
          Great news! You&#39;ve successfully joined. We&#39;re excited to have you ride with us!
        </Preview>
        <Container className="mx-auto py-5 pb-12">
          <Img
            src={imgURL}
            width="128"
            height="128"
            alt="Koala"
            className="mx-auto"
          />
          <Text className="text-[16px] leading-6.5">
            Hey {name}!
          </Text>
          <Text className="text-[16px] leading-6.5">
            Great news! You&#39;ve successfully joined <strong>{eventName}</strong>. We&#39;re excited to have you ride
            with us!
          </Text>

          <Section className="mb-4">
            <Row cellPadding={20} cellSpacing={5}>
              {bibNumber && (
                <Column align="center" className="h-10 w-1/3 bg-orange-400/60 py-2 rounded-md">
                  <Text className="m-0 font-semibold text-[12px]   leading-6">
                    Bib Number
                  </Text>
                  <div className="cn-font-heading text-lg font-semibold">
                    {"#" + String(bibNumber).padStart(3, "0")}
                  </div>
                </Column>
              )}

              {jerseySize && (
                <Column align="center" className="h-10 w-1/3 bg-orange-400/60 py-2 rounded-md">
                  <Text className="m-0 font-semibold text-[12px]   leading-6">
                    Jersey
                  </Text>
                  <div className="cn-font-heading text-lg font-semibold uppercase">
                    {jerseySize}
                  </div>
                </Column>
              )}

              {category && (
                <Column align="center" className="h-10 w-1/3 bg-orange-400/60 py-2 rounded-md">
                  <Text className="m-0 font-semibold text-[12px]   leading-6">
                    Category
                  </Text>
                  <div className="cn-font-heading text-lg font-semibold">
                    {category}
                  </div>
                </Column>
              )}
            </Row>
          </Section>

          <Section>
            <Row className="mb-2">
              <Column className="min-h-28 rounded-md bg-gray-100 px-10 py-6">
                <Text className="text-[14px] text-gray-700 mb-2">
                  <strong>📅 Date:</strong> {eventDate}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-2">
                  <strong>🕕 Time:</strong> {eventTime}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-2">
                  <strong>📍 Meeting Point:</strong> {meetingPoint}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section className="text-center">
            <Button
              className="bg-[#E86A1F] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={eventURL}>
              View Event Details
            </Button>
          </Section>

          <Text className="text-[16px]  mb-8 leading-relaxed">
            Don&#39;t forget to bring your helmet, water bottle, and a positive attitude! See you at the starting line.
          </Text>

          <Text className="text-[16px] leading-6.5">
            Best,
            <br/>
            Barong Cycling Team
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EventJoinedEmail.PreviewProps = {
  name: "Krisna",
  eventName: "Jakarta Morning Ride",
  eventDate: "January 25, 2026",
  eventTime: "06:00 AM",
  meetingPoint: "Monas, Central Jakarta",
  bibNumber: "002",
  jerseySize: "L",
  category: "Long"
};

export default EventJoinedEmail;
