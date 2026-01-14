import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Demo } from "@/components/demo";
import { Code } from "@/components/code";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          JSON becomes UI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Define a catalog. AI generates JSON. Your components render natively.
        </p>

        <Demo />

        <div className="flex gap-3 justify-center mt-12">
          <Button size="lg" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/vercel-labs/json-render"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-3">01</div>
              <h3 className="text-lg font-semibold mb-2">Define Catalog</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Specify which components AI can use with Zod schemas. Full type safety and validation.
              </p>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-3">02</div>
              <h3 className="text-lg font-semibold mb-2">Register Components</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Map catalog types to your React components. Use your own design system.
              </p>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-3">03</div>
              <h3 className="text-lg font-semibold mb-2">Let AI Generate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI outputs JSON matching your schema. Stream it. Render progressively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Define your catalog</h2>
              <p className="text-muted-foreground mb-6">
                Components, actions, and validation functions. All type-safe with Zod.
              </p>
              <Code lang="typescript">{`import { createCatalog } from '@json-render/core';
import { z } from 'zod';

export const catalog = createCatalog({
  components: {
    Card: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
      }),
      hasChildren: true,
    },
    Metric: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        format: z.enum(['currency', 'percent']),
      }),
    },
  },
  actions: {
    export: { params: z.object({ format: z.string() }) },
  },
});`}</Code>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI generates JSON</h2>
              <p className="text-muted-foreground mb-6">
                Constrained output that your components render natively.
              </p>
              <Code lang="json">{`{
  "key": "dashboard",
  "type": "Card",
  "props": {
    "title": "Revenue Dashboard",
    "description": null
  },
  "children": [
    {
      "key": "revenue",
      "type": "Metric",
      "props": {
        "label": "Total Revenue",
        "valuePath": "/metrics/revenue",
        "format": "currency"
      }
    }
  ]
}`}</Code>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <h2 className="text-2xl font-semibold mb-12 text-center">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Guardrails", desc: "AI can only use components you define in the catalog" },
              { title: "Streaming", desc: "Progressive rendering as JSON streams from the model" },
              { title: "Data Binding", desc: "Two-way binding with JSON Pointer paths" },
              { title: "Actions", desc: "Named actions handled by your application" },
              { title: "Visibility", desc: "Conditional show/hide based on data or auth" },
              { title: "Validation", desc: "Built-in and custom validation functions" },
            ].map((feature) => (
              <div key={feature.title}>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get started</h2>
          <pre className="inline-block text-left mb-8 text-sm">
            <code>npm install @json-render/core @json-render/react</code>
          </pre>
          <Button asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
