import { PolicyLayout } from '../../components/support/PolicyLayout'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function ReturnsPolicy() {
  useDocumentTitle('Returns & exchanges')

  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Returns & exchanges"
      description="Our would-be returns promise, written with the same care as the shop itself."
      intro="This page describes the returns policy the demo store is designed around. Because no real order is fulfilled, no return can be requested or processed here."
      sections={[
        {
          title: '30-day returns on print books',
          paragraphs: [
            'If a print book arrived damaged, wrongly printed or simply not right for you, the real Hawthorn promise would be a return within 30 days of delivery.',
            'Books should be in a resalable condition for a change-of-mind return. Damaged or incorrect items would be collected at no cost to the reader.',
          ],
        },
        {
          title: 'Digital editions',
          paragraphs: [
            'eBooks and audiobooks would be non-returnable once accessed, which is standard for digital goods. The demo does not distribute any digital files.',
          ],
        },
        {
          title: 'How a return would work',
          list: [
            'Write to hello@hawthorn.demo with your order number and a short note.',
            'A bookseller would reply with return instructions within two working days.',
            'Once the book was received, a refund would be issued to the original payment method.',
          ],
        },
        {
          title: 'Exchanges',
          paragraphs: [
            'If a different edition would suit you better, an exchange for the same title in another format would be arranged where stock allows. This is a design intention only — the demo cannot issue refunds or exchanges.',
          ],
        },
      ]}
    />
  )
}
