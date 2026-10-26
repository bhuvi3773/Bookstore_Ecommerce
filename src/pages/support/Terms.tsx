import { PolicyLayout } from '../../components/support/PolicyLayout'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Terms() {
  useDocumentTitle('Terms & conditions')

  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Terms & conditions"
      description="The straightforward version: this is a fictional bookstore and a frontend demonstration."
      intro="By using this site, you are exploring a portfolio project, not shopping at a real business. These terms set out what that means."
      sections={[
        {
          title: 'A demonstration, not a shop',
          paragraphs: [
            'Hawthorn Booksellers is a fictional store built with React, TypeScript and Vite. All titles, authors, ISBNs, reviews, prices and policies are invented for the demonstration.',
            'Placing a demo order does not create a contract, take a payment or reserve a book. No book will be shipped.',
          ],
        },
        {
          title: 'Pricing and availability',
          paragraphs: [
            'Prices are displayed in Indian rupees and are illustrative. Stock numbers exist to make the interface behave realistically and are not connected to any inventory system.',
            'Demo coupons and their conditions are described on the cart page. They are the only accepted codes.',
          ],
        },
        {
          title: 'Acceptable use',
          paragraphs: [
            'Please use the demo as intended: to explore the interface. Do not attempt to use it to process real transactions, and do not enter sensitive personal or payment information.',
          ],
        },
        {
          title: 'No warranty',
          paragraphs: [
            'The site is provided as-is for demonstration purposes, without warranties of any kind. Features may change or be removed at any time.',
          ],
        },
        {
          title: 'Intellectual property',
          paragraphs: [
            'The cover artwork is generated in CSS and SVG for this project. Fonts are provided by Google Fonts under their respective licences. The fictional titles and imprint names belong to the demo.',
          ],
        },
      ]}
    />
  )
}
