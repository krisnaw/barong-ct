import {Body, Button, Container, Head, Html, Img, Section, Tailwind, Text,} from '@react-email/components';
import * as React from "react";

interface EmailProps {
  email: string,
  url: string
}

const imgURL = "https://fi7tj80kxj.ufs.sh/f/jjB2MlHJbriWIPo3tMP916KnsQXzrbZ8jdfDLy0eJwl3qaVC"

export const SignupLink = ({email, url}: EmailProps) => (
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
            Click the button below to continue with {email}.
          </Text>

          <Text className="text-[16px] leading-[26px]">
            This link expires in 15 minutes.
          </Text>

          <Section className="text-center">
            <Button
              className="bg-[#E86A1F] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={url}>
              Continue
            </Button>
          </Section>

          <Text className="text-[12px]  leading-relaxed">
            If the button doesn&#39;t work, copy and paste this link:
          </Text>

          <Text className="text-[12px] text-blue-600 break-all mb-[32px]">
            {url}
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

SignupLink.PreviewProps = {
  email: "krisna.w2010@gmail.com",
  url: "https://app.example.com/auth/magic-link?token=abc123xyz789",
};


export default SignupLink;
