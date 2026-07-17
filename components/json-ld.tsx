/**
 * Injects a JSON-LD structured-data block. Escapes `<` so post content
 * containing `</script>` can't break out of the tag (XSS hardening).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
