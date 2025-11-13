import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Mail, FileText, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red-500/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-brand-red-600" />
          </div>
          <h1 className="text-5xl font-bold">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6 border-2">
          <CardContent className="p-8">
            <p className="text-lg leading-relaxed">
              At TMT's Coconut Cruisers, we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our car rental services and website.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-brand-red-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-2">
                  When you book a rental or contact us, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Driver's license number and expiration date</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Rental history and preferences</li>
                  <li>Insurance information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-2">
                  When you visit our website, we may automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Eye className="w-6 h-6 text-brand-red-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Process and manage your car rental reservations</li>
                <li>Communicate with you about your booking and provide customer support</li>
                <li>Process payments and prevent fraudulent transactions</li>
                <li>Send booking confirmations and rental reminders</li>
                <li>Improve our services and website functionality</li>
                <li>Comply with legal obligations and insurance requirements</li>
                <li>Send promotional offers (only with your consent)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="w-6 h-6 text-brand-red-600" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Service Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    We may share information with trusted third-party service providers who assist 
                    us in operating our business (payment processors, email services, etc.).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Legal Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    We may disclose information if required by law, court order, or government 
                    request, or to protect our rights and safety.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Insurance Purposes</h4>
                  <p className="text-sm text-muted-foreground">
                    We may share information with insurance companies in the event of an accident 
                    or insurance claim involving our vehicles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-brand-red-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Secure Payment Processing</p>
                    <p>
                      All payment information is processed through PCI-compliant payment partners. 
                      We do not store complete credit card information on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes 
                outlined in this policy, comply with legal obligations, resolve disputes, and enforce 
                our agreements. Rental records are typically maintained for 7 years in accordance with 
                Bahamian business record requirements.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information (subject to legal requirements)</li>
                <li>Object to or restrict certain processing of your information</li>
                <li>Opt-out of marketing communications at any time</li>
                <li>Request a copy of your personal information in a portable format</li>
              </ul>
              
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our website uses cookies and similar technologies to enhance your browsing experience 
                and analyze site traffic. Cookies are small data files stored on your device.
              </p>
              
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. However, disabling cookies may 
                limit your ability to use certain features of our website.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for individuals under the age of 21. We do not knowingly 
                collect personal information from children. If you believe we have inadvertently collected 
                information from a minor, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertCircle className="w-6 h-6 text-brand-red-600" />
                Changes to This Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or legal requirements. We will notify you of any material changes by posting the updated 
                policy on our website with a new "Last Updated" date. Your continued use of our services 
                after such changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-brand-red-200 bg-gradient-to-br from-brand-red-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-brand-red-900">
                <Mail className="w-6 h-6" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-red-800">
                If you have any questions, concerns, or requests regarding this Privacy Policy or 
                our data practices, please contact us:
              </p>
              
              <div className="space-y-2 text-brand-red-900">
                <p className="font-semibold">TMT's Coconut Cruisers</p>
                <p>Deadman's Cay, Long Island, Bahamas</p>
                <p>Email: <a href="mailto:info@tmtsbahamas.com" className="underline hover:text-brand-red-600">info@tmtsbahamas.com</a></p>
                <p>Phone: <a href="tel:+12424720016" className="underline hover:text-brand-red-600">+1 (242) 472-0016</a></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}