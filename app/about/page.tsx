import Layout from "@/components/Layout/Layout";

export default function AboutPage() {
  return (
    <Layout activePage="about">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Bariforce</h1>
          <p className="text-gray-600 mb-6">
            Bariforce is a trusted platform connecting customers with verified home service professionals.
            We believe that finding reliable help for your home should be simple, transparent, and secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Our mission is to empower local service providers while giving customers peace of mind.
            We vet every professional on our platform, handle secure payments, and provide 24/7 support.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Why Choose Bariforce?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>✅ Verified and background‑checked professionals</li>
            <li>✅ Transparent pricing – no hidden fees</li>
            <li>✅ Easy booking and real‑time updates</li>
            <li>✅ Secure online payments</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2026, Bariforce started with a simple idea: For Our University Project
          </p>
        </div>
      </div>
    </Layout>
  );
}