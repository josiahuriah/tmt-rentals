import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components"

type ContactMessageEmailProps = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export default function ContactMessageEmail({
  name,
  email,
  phone,
  subject,
  message,
}: ContactMessageEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          
          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>
          </Section>

          {phone && (
            <Section style={infoSection}>
              <Text style={label}>Phone:</Text>
              <Text style={value}>{phone}</Text>
            </Section>
          )}

          <Section style={infoSection}>
            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Text style={label}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This message was sent from the TMT's Coconut Cruisers contact form.
            </Text>
            <Text style={footerText}>
              Reply directly to this email to respond to {name}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const h1 = {
  color: "#000000",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 24px",
}

const infoSection = {
  padding: "0 24px",
  marginBottom: "16px",
}

const label = {
  color: "#666666",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px",
}

const value = {
  color: "#000000",
  fontSize: "16px",
  margin: "0 0 16px",
}

const messageText = {
  color: "#000000",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "24px 24px",
}

const footer = {
  padding: "0 24px",
}

const footerText = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "8px 0",
}

ContactMessageEmail.PreviewProps = {
  name: "John Doe",
  email: "john@example.com",
  phone: "242-555-1234",
  subject: "Question about car rental",
  message: "I'm interested in renting a vehicle for my upcoming trip to Long Island. Can you help me with availability?",
} as ContactMessageEmailProps