import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Mail, MapPin, Phone, Loader2, Send } from "lucide-react";
import { Loader2, Send } from "lucide-react";
import { LandingNavbar } from "./landing/LandingNavbar";
import { Footer } from "./landing/Footer";
import { InputField } from "../../ui/shared/InputField";
import { InputTextArea } from "../../ui/shared/InputTextArea";
import { Button } from "../../ui/shared/Btn";
import { useNotificationStore } from "../../../stores/notification";

export const Contact: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (_values, helpers) => {
      setIsPending(true);
      // Simulate API call
      setTimeout(() => {
        setIsPending(false);
        showCardNotification({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });
        helpers.resetForm();
        setTimeout(() => hideCardNotification(), 5000);
      }, 1500);
    },
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />

      <main className="container mx-auto px-4 max-w-6xl py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          {/* <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Have questions about our curriculum or need support? Our team is
              here to help you on your educational journey.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">
                    Kampala, Uganda
                    <br />
                    Bitcoin High School Campus
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:support@bitcoinhighschool.com"
                      className="hover:text-purple-600 transition-colors"
                    >
                      support@bitcoinhighschool.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Send us your query anytime!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">0800 123 456</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon to Fri 9am to 6pm
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100 border border-gray-100 md:col-span-2 max-w-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Send a Message
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <InputField
                name="name"
                label="Your Name"
                placeholder="John Doe"
                type="text"
                formik={formik}
                required={true}
              />

              <InputField
                name="email"
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                formik={formik}
                required={true}
              />

              <InputField
                name="subject"
                label="Subject"
                placeholder="How can we help?"
                type="text"
                formik={formik}
                required={true}
              />

              <InputTextArea
                name="message"
                label="Message"
                placeholder="Type your message here..."
                formik={formik}
                required={true}
                className="min-h-[120px]"
              />

              <Button
                type="submit"
                className="w-full text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="md:col-span-2 text-center mt-8">
            <p className="text-gray-600">
              Or email us directly at{" "}
              <a
                href="mailto:support@bitcoinhighschool.com"
                className="text-purple-600 hover:underline"
              >
                support@bitcoinhighschool.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
