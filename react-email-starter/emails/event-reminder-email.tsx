import {Body, Button, Container, Head, Html, Img, Section, Tailwind, Text,} from '@react-email/components';
import * as React from "react";

interface EmailProps {
  name: string,
  url: string
}

const imgURL = "https://fi7tj80kxj.ufs.sh/f/jjB2MlHJbriWIPo3tMP916KnsQXzrbZ8jdfDLy0eJwl3qaVC"

export const EventReminder = ({name, url}: EmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-koala">
        <Container className="mx-auto py-5 pb-12">
          <Img
            src={imgURL}
            width="128"
            height="128"
            alt="Koala"
            className="mx-auto"
          />
          <Text className="text-[16px] leading-[26px]">
            Hello {name}!,
          </Text>
          <Text className="text-[16px] leading-[26px]">
            Thanks for completing your profile.
          </Text>
          <Text className="text-[16px] leading-[26px]">
            This is a quick reminder that you haven’t joined the event yet. If you’re planning to attend, you can join the event using the link below.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#E86A1F] rounded-[3px] text-white text-[16px] no-underline text-center block p-3 uppercase"
              href={url}>
              Join Now
            </Button>
          </Section>

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

EventReminder.PreviewProps = {
  name: "Krisna",
  url: "https://www.barongmelali.com",
};


export default EventReminder;
