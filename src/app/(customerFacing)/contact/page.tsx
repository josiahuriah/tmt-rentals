import { ContactForm } from "@/components/customer/ContactForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (<>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help! Reach out
            to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll respond within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <a
                        href="tel:+12424720016"
                        className="text-sm text-muted-foreground hover:text-brand-red-600 transition-colors"
                      >
                        +1 (242) 472-0016
                      </a>
                      <br />
                      <a
                        href="tel:+12423670942"
                        className="text-sm text-muted-foreground hover:text-brand-red-600 transition-colors"
                      >
                        +1 (242) 367-0942
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:info@tmtsbahamas.com"
                        className="text-sm text-muted-foreground hover:text-brand-red-600 transition-colors"
                      >
                        info@tmtsbahamas.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-red-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Location</p>
                      <p className="text-sm text-muted-foreground">
                        Deadman's Cay<br />
                        Long Island, Bahamas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Monday - Sunday<br />
                        8:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-red-50 to-red-100 border-brand-red-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-brand-red-900 mb-3">
                  📞 Need Immediate Assistance?
                </h3>
                <p className="text-sm text-brand-red-800 mb-4">
                  For urgent matters or immediate booking assistance, please
                  call us directly at:
                </p>
                <a
                  href="tel:+12424720016"
                  className="block text-center bg-brand-red-600 hover:bg-brand-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  +1 (242) 472-0016
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map or Additional Info Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Why Choose Us?</h3>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <div className="text-3xl font-bold text-brand-red-600 mb-2">
                      5+
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Years of Experience
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand-red-600 mb-2">
                      100+
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Happy Customers
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand-red-600 mb-2">
                      24/7
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer Support
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>)
}