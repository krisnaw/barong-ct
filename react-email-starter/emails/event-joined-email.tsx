import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from "react";

interface EmailProps {
  name: string,
  eventName: string,
  eventDate : string,
  eventTime : string,
  meetingPoint : string,
  eventURL: string,
}

const imgURL = "https://fi7tj80kxj.ufs.sh/f/jjB2MlHJbriWIPo3tMP916KnsQXzrbZ8jdfDLy0eJwl3qaVC"

export const EventJoinedEmail = ({name, eventName, eventDate, eventTime, meetingPoint, eventURL}: EmailProps) => (
  <Html>
    <Head />
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
          <Text className="text-[16px] leading-[26px]">
            Hey {name}!
          </Text>
          <Text className="text-[16px] leading-[26px]">
            Great news! You&#39;ve successfully joined <strong>{eventName}</strong>. We&#39;re excited to have you ride with us!
          </Text>

          <Section>
            <Row className="mb-2">
              <Column className="min-h-[112px] rounded-md bg-gray-100 px-10 py-6">

                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  <strong>📅 Date:</strong> {eventDate}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  <strong>🕕 Time:</strong> {eventTime}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-[8px]">
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

          <Text className="text-[16px]  mb-[32px] leading-relaxed">
            Don&#39;t forget to bring your helmet, water bottle, and a positive attitude! See you at the starting line.
          </Text>

          <Text className="text-[16px] leading-[26px]">
            Best,
            <br />
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
};


export default EventJoinedEmail;
