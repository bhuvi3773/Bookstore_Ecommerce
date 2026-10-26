import { Link } from 'react-router-dom'
import { Brand } from './Brand'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-trust">
        <div className="container footer-trust__inner">
          <Reveal className="footer-trust__item">
            <Icon name="truck" size={21} />
            <div><strong>Free delivery over ₹1,499</strong><span>Standard delivery in 3–5 days</span></div>
          </Reveal>
          <Reveal className="footer-trust__item" delay={45}>
            <Icon name="refresh" size={21} />
            <div><strong>30-day returns</strong><span>Changed your mind? No problem</span></div>
          </Reveal>
          <Reveal className="footer-trust__item" delay={90}>
            <Icon name="shield" size={21} />
            <div><strong>Secure demo checkout</strong><span>No real payment is ever taken</span></div>
          </Reveal>
          <Reveal className="footer-trust__item" delay={135}>
            <Icon name="book" size={21} />
            <div><strong>Wrapped with care</strong><span>Recyclable, book-safe packaging</span></div>
          </Reveal>
        </div>
      </div>

      <div className="container footer-main">
        <Reveal className="footer-brand">
          <Brand light />
          <p>
            An independent online bookshop for readers who like to take their time. Thoughtful shelves,
            beautiful editions and a good reason to stay up late.
          </p>
          <div className="footer-contact">
            <a href="mailto:hello@hawthorn.demo"><Icon name="mail" size={15} /> hello@hawthorn.demo</a>
            <span><Icon name="clock" size={15} /> Mon–Fri, 9am–6pm IST</span>
          </div>
          <span className="footer-demo-note">Frontend demonstration · online only</span>
        </Reveal>

        <Reveal className="footer-column" delay={45}>
          <h2>Discover</h2>
          <Link to="/books">All books</Link>
          <Link to="/books?sort=newest">New &amp; notable</Link>
          <Link to="/books?collection=editors">Editor&apos;s picks</Link>
          <Link to="/categories/poetry">Poetry</Link>
          <Link to="/categories/children-s">For young readers</Link>
          <Link to="/books?max=599">Under ₹599</Link>
        </Reveal>

        <Reveal className="footer-column" delay={90}>
          <h2>Customer care</h2>
          <Link to="/contact">Contact us</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/shipping-policy">Delivery &amp; shipping</Link>
          <Link to="/returns-policy">Returns &amp; exchanges</Link>
          <Link to="/account">Track a demo order</Link>
        </Reveal>

        <Reveal className="footer-column" delay={135}>
          <h2>The shop</h2>
          <Link to="/about">Our story</Link>
          <Link to="/account">My account</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/privacy-policy">Privacy policy</Link>
          <Link to="/terms">Terms &amp; conditions</Link>
        </Reveal>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>© {currentYear} Hawthorn Booksellers. A fictional frontend demo.</span>
          <div className="footer-payments" aria-label="Demo payment methods">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>COD</span>
          </div>
          <a href="#top" className="footer-top-link">Back to top <Icon name="arrow-up" size={14} /></a>
        </div>
      </div>
    </footer>
  )
}
