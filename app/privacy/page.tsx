import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#02040b] px-4 py-8 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-[760px] space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="space-y-1">
          <p className="flex items-center gap-2 text-4xl font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-rose-500/15">
              <Shield className="h-4 w-4 text-rose-300" />
            </span>
            Privacy Policy
          </p>
          <p className="text-xs text-zinc-500">Last updated March 4, 2026</p>
        </div>

        <article className="prose prose-invert max-w-none text-zinc-200 prose-h3:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300">
          <h3>1. Information We Collect</h3>
          <p>
            When you use WeaveDirector, we collect information that you provide directly to us, including your name, email address, and any content you upload or generate using our services.
            We also collect usage and system activity data to improve reliability and user experience.
          </p>

          <h3>2. How We Use Your Information</h3>
          <ul>
            <li>Provide, maintain, and improve our AI-driven creative tools.</li>
            <li>Process your requests and generate campaign materials.</li>
            <li>Send you technical notices, updates, and support responses.</li>
            <li>Respond to comments, questions, and customer service requests.</li>
          </ul>

          <h3>3. AI Processing and Data Usage</h3>
          <p>
            WeaveDirector utilizes advanced AI models to process your inputs and generate creative output. Your prompts and generated content may be processed by trusted third-party AI providers.
            However, we do not use your generated campaign briefs to train our foundational models without your explicit consent.
          </p>

          <h3>4. Data Security</h3>
          <p>
            We implement appropriate technical and organizational security measures designed to protect the security of your personal information we process.
            However, please note no method of transmission over the internet is 100% secure.
          </p>

          <h3>5. Your Privacy Rights</h3>
          <p>
            Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete your data.
            You can manage most of your data directly from your account settings page.
          </p>

          <h3>6. Contact Us</h3>
          <p>
            If you have questions or comments about this notice, you may email us at <strong>privacy@weavedirector.com</strong> or contact us by post at:
          </p>
          <p>
            WeaveDirector Inc.<br />
            123 Creative Flow Ave.<br />
            San Francisco, CA 94105
          </p>
        </article>
      </div>
    </div>
  )
}

