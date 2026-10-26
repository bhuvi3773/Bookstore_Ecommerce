import { PolicyLayout } from '../../components/support/PolicyLayout'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function PrivacyPolicy() {
  useDocumentTitle('Privacy policy')

  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Privacy policy"
      description="What this demo stores, where it goes, and why the honest answer is: nowhere."
      intro="Hawthorn is a static frontend demonstration. It has no server, no database and no analytics. Everything you do here stays in your browser's localStorage."
      sections={[
        {
          title: 'What is stored on your device',
          list: [
            'Your bag, including book IDs, quantities and chosen formats.',
            'Your wishlist and recently viewed book IDs.',
            'Demo orders, including the address and contact details you type into checkout.',
            'The active coupon code and the name and email of the demo account you sign in with.',
          ],
        },
        {
          title: 'What is never collected',
          paragraphs: [
            'No data is sent to a server. There is no analytics script, no advertising tracker and no real authentication. No password is checked or stored.',
            'Please do not enter real payment details anywhere on this site. The demo never asks for them, and no payment form is connected to a processor.',
          ],
        },
        {
          title: 'Removing your data',
          paragraphs: [
            'All demo data can be cleared by removing this site\'s data in your browser settings. Clearing site data removes your bag, wishlist, demo orders and the demo account name from this device.',
          ],
        },
        {
          title: 'Contact',
          paragraphs: [
            'Questions about this demo can be sent to hello@hawthorn.demo. It is a fictional address in a fictional bookshop, so no one will reply — but the intention is sincere.',
          ],
        },
      ]}
    />
  )
}
