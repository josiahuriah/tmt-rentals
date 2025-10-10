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
  Row,
  Column,
  Img,
} from "@react-email/components"
import { formatCurrency } from "@/lib/formatters"
import { format } from "date-fns"

type BookingConfirmationEmailProps = {
  booking: {
    bookingNumber: string
    pickupDate: Date
    returnDate: Date
    numberOfDays: number
    pricePerDay: number
    subtotal: number
    taxAmount: number
    totalAmount: number
    depositAmount: number
    pickupLocation: string
    returnLocation: string
    additionalDriver?: string | null
    specialRequests?: string | null
    customer: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    category: {
      name: string
      description: string | null
    }
    car?: {
      name: string
      licensePlate: string | null
    } | null
  }
}

export default function BookingConfirmationEmail({
  booking,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your booking {booking.bookingNumber} is confirmed! View your rental details.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Heading style={h1}>Booking Confirmed! 🎉</Heading>
            <Text style={successText}>
              Your car rental reservation has been successfully confirmed.
            </Text>
          </Section>

          {/* Booking Number */}
          <Section style={bookingNumberSection}>
            <Text style={bookingNumberLabel}>Booking Number</Text>
            <Text style={bookingNumber}>{booking.bookingNumber}</Text>
          </Section>

          <Hr style={hr} />

          {/* Customer Information */}
          <Section>
            <Heading as="h2" style={h2}>
              Customer Information
            </Heading>
            <Row>
              <Column>
                <Text style={label}>Name:</Text>
                <Text style={value}>
                  {booking.customer.firstName} {booking.customer.lastName}
                </Text>
              </Column>
              <Column>
                <Text style={label}>Email:</Text>
                <Text style={value}>{booking.customer.email}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Phone:</Text>
                <Text style={value}>{booking.customer.phone}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Vehicle Information */}
          <Section>
            <Heading as="h2" style={h2}>
              Vehicle Details
            </Heading>
            <Text style={vehicleName}>{booking.category.name}</Text>
            {booking.category.description && (
              <Text style={vehicleDescription}>{booking.category.description}</Text>
            )}
            {booking.car && (
              <Text style={value}>
                Assigned Vehicle: {booking.car.name}
                {booking.car.licensePlate && ` (${booking.car.licensePlate})`}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Rental Period */}
          <Section>
            <Heading as="h2" style={h2}>
              Rental Period
            </Heading>
            <Row>
              <Column>
                <Text style={label}>Pickup:</Text>
                <Text style={value}>
                  {format(new Date(booking.pickupDate), "EEE, MMM d, yyyy")}
                </Text>
                <Text style={locationText}>{booking.pickupLocation}</Text>
              </Column>
              <Column>
                <Text style={label}>Return:</Text>
                <Text style={value}>
                  {format(new Date(booking.returnDate), "EEE, MMM d, yyyy")}
                </Text>
                <Text style={locationText}>{booking.returnLocation}</Text>
              </Column>
            </Row>
            <Text style={value}>
              Duration: {booking.numberOfDays}{" "}
              {booking.numberOfDays === 1 ? "Day" : "Days"}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Payment Summary */}
          <Section>
            <Heading as="h2" style={h2}>
              Payment Summary
            </Heading>
            <Row>
              <Column style={summaryLabelColumn}>
                <Text style={summaryLabel}>
                  Daily Rate × {booking.numberOfDays}
                </Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>
                  {formatCurrency(booking.subtotal)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={summaryLabelColumn}>
                <Text style={summaryLabel}>Tax (10%)</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>
                  {formatCurrency(booking.taxAmount)}
                </Text>
              </Column>
            </Row>
            <Hr style={summaryHr} />
            <Row>
              <Column style={summaryLabelColumn}>
                <Text style={totalLabel}>Total Paid</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={totalValue}>
                  {formatCurrency(booking.totalAmount)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={summaryLabelColumn}>
                <Text style={depositLabel}>Security Deposit (Refundable)</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={depositValue}>
                  {formatCurrency(booking.depositAmount)}
                </Text>
              </Column>
            </Row>
          </Section>

          {booking.additionalDriver && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={label}>Additional Driver:</Text>
                <Text style={value}>{booking.additionalDriver}</Text>
              </Section>
            </>
          )}

          {booking.specialRequests && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={label}>Special Requests:</Text>
                <Text style={value}>{booking.specialRequests}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Important Information */}
          <Section style={infoBox}>
            <Heading as="h3" style={infoHeading}>
              📋 Important Information
            </Heading>
            <Text style={infoText}>
              • Bring your valid driver's license and this confirmation
              <br />
              • Arrive 15 minutes before your pickup time
              <br />
              • The ${booking.depositAmount} security deposit will be refunded
              upon vehicle return
              <br />• For questions, contact us at +1 (242) 472-0016
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for choosing TMT's Coconut Cruisers!
            </Text>
            <Text style={footerText}>
              Need help? Reply to this email or call us at +1 (242) 472-0016
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
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

const header = {
  padding: "32px 24px",
  textAlign: "center" as const,
  backgroundColor: "#000000",
}

const h1 = {
  color: "#FFD700",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px",
}

const successText = {
  color: "#ffffff",
  fontSize: "16px",
  margin: 0,
}

const bookingNumberSection = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#FFF9E6",
  margin: "0 24px",
  borderRadius: "8px",
}

const bookingNumberLabel = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 8px",
}

const bookingNumber = {
  color: "#000000",
  fontSize: "28px",
  fontWeight: "bold",
  margin: 0,
}

const h2 = {
  color: "#000000",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px",
  padding: "0 24px",
}

const label = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 4px",
  padding: "0 24px",
}

const value = {
  color: "#000000",
  fontSize: "16px",
  margin: "0 0 16px",
  padding: "0 24px",
}

const vehicleName = {
  color: "#000000",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 8px",
  padding: "0 24px",
}

const vehicleDescription = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 16px",
  padding: "0 24px",
}

const locationText = {
  color: "#666666",
  fontSize: "12px",
  margin: "4px 0 16px",
  padding: "0 24px",
}

const summaryLabelColumn = {
  width: "70%",
  padding: "0 24px",
}

const summaryValueColumn = {
  width: "30%",
  textAlign: "right" as const,
  padding: "0 24px",
}

const summaryLabel = {
  color: "#666666",
  fontSize: "14px",
  margin: "8px 0",
}

const summaryValue = {
  color: "#000000",
  fontSize: "14px",
  margin: "8px 0",
}

const summaryHr = {
  borderColor: "#e6e6e6",
  margin: "16px 24px",
}

const totalLabel = {
  color: "#000000",
  fontSize: "18px",
  fontWeight: "600",
  margin: "8px 0",
}

const totalValue = {
  color: "#16a34a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "8px 0",
}

const depositLabel = {
  color: "#666666",
  fontSize: "12px",
  margin: "8px 0",
}

const depositValue = {
  color: "#666666",
  fontSize: "12px",
  margin: "8px 0",
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "24px 24px",
}

const infoBox = {
  backgroundColor: "#EFF6FF",
  padding: "24px",
  margin: "0 24px",
  borderRadius: "8px",
  borderLeft: "4px solid #3B82F6",
}

const infoHeading = {
  color: "#1E40AF",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
}

const infoText = {
  color: "#1E3A8A",
  fontSize: "14px",
  lineHeight: "24px",
  margin: 0,
}

const footer = {
  padding: "24px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "8px 0",
}

BookingConfirmationEmail.PreviewProps = {
  booking: {
    bookingNumber: "BK-20250110-0001",
    pickupDate: new Date("2025-01-15"),
    returnDate: new Date("2025-01-20"),
    numberOfDays: 5,
    pricePerDay: 80,
    subtotal: 400,
    taxAmount: 40,
    totalAmount: 440,
    depositAmount: 100,
    pickupLocation: "Deadman's Cay, Long Island, Bahamas",
    returnLocation: "Deadman's Cay, Long Island, Bahamas",
    additionalDriver: "Jane Doe, 28",
    specialRequests: "Need GPS and child seat",
    customer: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "242-555-1234",
    },
    category: {
      name: "Sedan",
      description: "Comfortable sedans for business or leisure",
    },
    car: {
      name: "Ford Fusion",
      licensePlate: "BAH-S001",
    },
  },
} as BookingConfirmationEmailProps