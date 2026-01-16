import * as React from 'react';
import {Body, Button, Container, Head, Html, Section, Tailwind, Text,} from '@react-email/components';

type Props = {
  name: string,
  eventName: string,
  eventDate : string,
  eventTime : string,
  meetingPoint : string,
  eventURL: string,
}

const CyclingEventConfirmationEmail = ({ name, eventName, eventDate, eventTime, meetingPoint, eventURL} : Props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Text className="text-[32px] font-bold text-gray-900 mb-[24px] text-center">
                🚴‍♂️ You&#39;re In!
              </Text>

              <Text className="text-[18px] text-gray-700 mb-[24px] leading-relaxed">
                Hey {name}!
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-relaxed">
                Great news! You&#39;ve successfully joined <strong>{eventName}</strong>. We&#39;re excited to have you ride with us!
              </Text>

              <Section className="bg-blue-50 p-[24px] rounded-[8px] mb-[32px]">
                <Text className="text-[18px] font-bold text-gray-900 mb-[16px]">
                  Event Details
                </Text>

                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  <strong>📅 Date:</strong> {eventDate}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  <strong>🕕 Time:</strong> {eventTime}
                </Text>

                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  <strong>📍 Meeting Point:</strong> {meetingPoint}
                </Text>

              </Section>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-relaxed">
                Don&#39;t forget to bring your helmet, water bottle, and a positive attitude! See you at the starting line.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={eventURL}
                  className="bg-green-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-green-700 transition-colors"
                >
                  View Event Details
                </Button>
              </Section>
              
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

CyclingEventConfirmationEmail.PreviewProps = {
  name: "Krisna",
  eventName: "Jakarta Morning Ride",
  eventDate: "January 25, 2026",
  eventTime: "06:00 AM",
  meetingPoint: "Monas, Central Jakarta",
};

export default CyclingEventConfirmationEmail;