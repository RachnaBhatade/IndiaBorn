import './Story.css'

export default function Story() {
  return (
    <section className="split" id="story">
      <div>
        <span className="eyebrow">ABOUT</span>
        <h2>Born in India, made for the world</h2>
        <p>
          Indiaborn™ celebrates handcrafted jewelry from Jaipur to Coimbatore.
          Each piece is sustainably sourced, hypoallergenic, and designed for
          seamless day-to-night styling.
        </p>
        <ul>
          <li>Ethically sourced 18K vermeil</li>
          <li>Water and sweat resistant</li>
          <li>Complimentary lifetime polishing</li>
        </ul>
      </div>
      <div className="card">
        <h3>Need it personalized?</h3>
        <p>
          Our design team can engrave initials, motifs, and wedding crests.
        </p>
        <a className="button button--ghost" href="tel:+919834559443">
          Talk to a stylist
        </a>
      </div>
    </section>
  )
}

