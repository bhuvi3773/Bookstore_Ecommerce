import { PolicyLayout } from '../../components/support/PolicyLayout'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function ShippingPolicy() {
  useDocumentTitle('Delivery & shipping')

  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Delivery & shipping"
      description="How books would travel from our shelves to your door — and what is actually happening in this demo."
      intro="Hawthorn is a frontend demonstration, so no parcel will ever leave a warehouse. This page describes the delivery experience the store is designed to simulate."
      sections={[
        {
          title: 'Delivery options',
          paragraphs: [
            'Standard delivery is our default, with an estimated window of 3–5 business days. Express delivery arrives in 1–2 business days and is prioritised in the demo checkout.',
            'Standard delivery is free on orders over ₹1,499. Below that, a flat ₹99 standard delivery fee applies. Express delivery costs ₹149 regardless of order value.',
          ],
          list: [
            'Standard delivery: 3–5 business days · ₹99, free over ₹1,499',
            'Express delivery: 1–2 business days · ₹149',
            'Digital formats (eBook and Audiobook): described as instant in the demo, with no shipping charge shown',
          ],
        },
        {
          title: 'Where we deliver',
          paragraphs: [
            'The demo address form is set up for Indian addresses and validates a six-digit pincode. No address is sent anywhere; it is stored only in your browser with the order.',
          ],
        },
        {
          title: 'Tracking',
          paragraphs: [
            'A real shop would send a tracking link once a parcel left the building. Here, the demo order page shows a three-step status timeline — confirmed, processing and shipped — that is illustrative and does not advance automatically.',
          ],
        },
        {
          title: 'Packaging',
          paragraphs: [
            'The shop is styled around careful, recyclable packaging: paper wrap, a board-backed book and a handwritten shelf note. It is a design promise rather than a live service.',
          ],
        },
      ]}
    />
  )
}
