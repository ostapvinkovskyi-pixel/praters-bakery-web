// Structured data for search engines (LocalBusiness / Bakery).
export const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Praters Bakery",
  slogan: "Simple & Southern",
  foundingDate: "2019",
  email: "Pratersbakery@gmail.com",
  priceRange: "$1-10",
  servesCuisine: "Southern baked goods",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2210 India Hook Rd #101",
    addressLocality: "Rock Hill",
    addressRegion: "SC",
    postalCode: "29732",
    addressCountry: "US",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "73" },
};
