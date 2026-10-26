import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { PageHeader } from '../../components/ui/PageHeader'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const groups = [
  {
    title: 'About the shop',
    questions: [
      {
        q: 'Is Hawthorn a real bookstore?',
        a: 'No. Hawthorn Booksellers is a fictional bookshop and a complete frontend demonstration. Every title, author, review and policy is invented for this project.',
      },
      {
        q: 'Can I actually buy a book here?',
        a: 'You can complete the full shopping journey — browse, add to bag, apply a demo coupon and place a demo order — but no payment is taken and no book is shipped.',
      },
      {
        q: 'How were the covers made?',
        a: 'Each cover is an original CSS and SVG composition generated from the book’s category, palette and title. No stock photography is used for the artwork.',
      },
    ],
  },
  {
    title: 'Orders & delivery',
    questions: [
      {
        q: 'Where are my orders stored?',
        a: 'Demo orders are saved in your browser’s localStorage on this device. They will not appear in another browser, and clearing site data will remove them.',
      },
      {
        q: 'What do the delivery options cost?',
        a: 'Standard delivery is ₹99, and free on orders over ₹1,499. Express delivery is ₹149. These amounts are simulated in the checkout summary.',
      },
      {
        q: 'Why does my order status not change?',
        a: 'The confirmation page shows an illustrative confirmed → processing → shipped timeline. No fulfilment system is connected, so the status stays where the demo placed it.',
      },
      {
        q: 'Can I return a book?',
        a: 'The returns page describes the 30-day policy the shop is designed around, but this demo cannot process returns or refunds.',
      },
    ],
  },
  {
    title: 'Coupons & account',
    questions: [
      {
        q: 'Which coupon codes work?',
        a: 'WELCOME10, READ15, SHELF20 and FREESHIP are the only accepted codes. Each has a minimum subtotal and, for percentage codes, a maximum discount. The cart lists all four.',
      },
      {
        q: 'Why was my coupon rejected?',
        a: 'The usual reasons are a subtotal below the code’s minimum or a mistyped code. The cart gives a specific message when a code is rejected, and a code that becomes ineligible after a quantity change is explained in the summary.',
      },
      {
        q: 'Do I need an account to order?',
        a: 'No. The demo account is optional. It adds a name to the header and keeps your account page personal, but the guest shopping flow is complete without it.',
      },
      {
        q: 'Is my password stored?',
        a: 'No. The demo never checks, transmits or stores a password. Signing in only saves the name and email you type, in this browser, so the demo can greet you.',
      },
    ],
  },
  {
    title: 'Accessibility & technology',
    questions: [
      {
        q: 'Does the site respect reduced motion?',
        a: 'Yes. If your device requests reduced motion, reveal animations, page transitions and decorative motion are minimised or removed.',
      },
      {
        q: 'Can I use the site with a keyboard?',
        a: 'The menus, dialogs, filters, cart and checkout are built to be keyboard operable, with visible focus states, Escape-to-close behaviour and a skip link at the top of the page.',
      },
      {
        q: 'What was it built with?',
        a: 'React 19, TypeScript, Vite and React Router. There is no backend, no database and no additional UI or animation library.',
      },
    ],
  },
]

export default function FAQ() {
  useDocumentTitle('FAQs')

  return (
    <div className="faq-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">FAQs</span>
        </nav>

        <PageHeader
          eyebrow="Help & answers"
          title="Frequently asked questions."
          description="The honest answers about the shop, the demo, your data and the books — including the questions a fictional bookstore rarely gets asked."
        />

        <div className="faq-layout">
          <div className="faq-main">
            {groups.map((group) => (
              <section className="faq-group" key={group.title} aria-labelledby={`faq-${group.title.replace(/\s+/g, '-').toLowerCase()}`}>
                <h2 id={`faq-${group.title.replace(/\s+/g, '-').toLowerCase()}`}>{group.title}</h2>
                <div className="faq-list">
                  {group.questions.map((item) => (
                    <details className="faq-item" key={item.q}>
                      <summary>
                        <span>{item.q}</span>
                        <span className="faq-item__icon" aria-hidden="true"><Icon name="plus" size={15} /></span>
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="faq-side">
            <div className="faq-side__card">
              <span className="faq-side__icon"><Icon name="mail" size={20} /></span>
              <h2>Still stuck?</h2>
              <p>Send a note to our booksellers. The form validates properly, even if the postbox is fictional.</p>
              <Link to="/contact" className="btn btn--primary">Contact us</Link>
            </div>
            <div className="faq-side__links">
              <h2>Useful pages</h2>
              <Link to="/shipping-policy"><span>Delivery &amp; shipping</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/returns-policy"><span>Returns &amp; exchanges</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/privacy-policy"><span>Privacy policy</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/about"><span>Our story</span><Icon name="arrow-right" size={14} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
