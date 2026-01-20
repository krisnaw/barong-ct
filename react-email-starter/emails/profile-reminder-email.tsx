import {Body, Button, Container, Head, Html, Img, Section, Tailwind, Text,} from '@react-email/components';
import * as React from "react";

interface EmailProps {
  email: string,
  url: string
}

const imgURL = "https://fi7tj80kxj.ufs.sh/f/jjB2MlHJbriWIPo3tMP916KnsQXzrbZ8jdfDLy0eJwl3qaVC"

export const ProfileReminder = ({email, url}: EmailProps) => (
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
            Hello Cyclist,
          </Text>
          <Text className="text-[16px] leading-[26px]">
            Thanks for registering. Please complete your profile to join the event.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#E86A1F] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={url}>
              Complete profile
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

ProfileReminder.PreviewProps = {
  email: "krisna.w2010@gmail.com",
  url: "https://www.barongmelali.com",
};


export default ProfileReminder;
