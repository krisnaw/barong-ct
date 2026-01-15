import * as React from 'react';
import {Body, Button, Container, Head, Html, pixelBasedPreset, Section, Tailwind, Text,} from '@react-email/components';

const MagicLinkEmail = ({email, url} : { email: string, url: string}) => {

  return (
    <Html lang="en" dir="ltr">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            <Section>

              <Text className="text-[32px] font-bold text-gray-900 mb-[24px] text-center">
                Sign in to your account
              </Text>

              <Text className="text-[18px] text-gray-700 mb-[24px] leading-relaxed">
                Hello!
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-relaxed">
                Click the button below to continue with {email}.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={url}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-blue-700 transition-colors"
                >
                  Continue
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[32px] leading-relaxed">
                This link expires in 15 minutes.
              </Text>

              <Text className="text-[12px] text-gray-500 leading-relaxed">
                If the button doesn&#39;t work, copy and paste this link:
              </Text>

              <Text className="text-[12px] text-blue-600 break-all mb-[32px]">
                {url}
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

MagicLinkEmail.PreviewProps = {
  email: "krisna.w2010@gmail.com",
  url: "https://app.example.com/auth/magic-link?token=abc123xyz789",
};

export default MagicLinkEmail;