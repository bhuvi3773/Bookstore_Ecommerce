export interface SampleReview {
  name: string
  rating: number
  title: string
  body: string
  date: string
}

const reviewers = ['Ananya R.', 'Kabir M.', 'Meera S.', 'Rohan D.', 'Ishita P.', 'Vikram N.', 'Sara K.', 'Dev A.']

const reviewBank: Record<string, SampleReview[]> = {
  Fiction: [
    { name: 'Ananya R.', rating: 5, title: 'Stayed with me for days', body: 'The kind of book where you slow down near the end because you are not ready to leave the characters behind.', date: '12 Sep 2025' },
    { name: 'Kabir M.', rating: 4, title: 'Quietly brilliant', body: 'Beautifully observed and never showy. I underlined whole passages and immediately passed it to a friend.', date: '02 Aug 2025' },
    { name: 'Meera S.', rating: 5, title: 'Perfect for book club', body: 'We talked about this one for three hours. Layered, generous and full of small surprises.', date: '21 Jul 2025' },
  ],
  Mystery: [
    { name: 'Rohan D.', rating: 5, title: 'Read it in one sitting', body: 'A genuinely clever mystery with an atmosphere you can almost feel. I did not see the final turn coming.', date: '18 Oct 2025' },
    { name: 'Ishita P.', rating: 4, title: 'Atmospheric and sharp', body: 'The setting does so much work here. Tense without being grim, and the detective is a joy.', date: '07 Sep 2025' },
    { name: 'Sara K.', rating: 5, title: 'A proper page-turner', body: 'Every chapter ends on a hook. Cancel your evening plans before you start.', date: '29 Jun 2025' },
  ],
  Romance: [
    { name: 'Meera S.', rating: 5, title: 'So tender', body: 'Warm, funny and genuinely romantic. The kind of love story that feels like a long exhale.', date: '14 Oct 2025' },
    { name: 'Ananya R.', rating: 4, title: 'A lovely escape', body: 'The chemistry is lovely and the side characters steal every scene. Perfect for a rainy weekend.', date: '03 Aug 2025' },
    { name: 'Dev A.', rating: 5, title: 'The comfort read I needed', body: 'I smiled the whole way through. Already looking for more from this author.', date: '22 May 2025' },
  ],
  Fantasy: [
    { name: 'Vikram N.', rating: 5, title: 'A world to get lost in', body: 'Inventive, immersive and beautifully paced. The final hundred pages are pure momentum.', date: '09 Oct 2025' },
    { name: 'Ishita P.', rating: 5, title: 'Everything I want from fantasy', body: 'Big emotions, sharp politics and a cast I would follow into another trilogy.', date: '17 Aug 2025' },
    { name: 'Kabir M.', rating: 4, title: 'Rich and rewarding', body: 'It asks a little patience at the start and repays it many times over. The hardcover is gorgeous.', date: '30 Jun 2025' },
  ],
  'Self-Help': [
    { name: 'Sara K.', rating: 5, title: 'Kind and actually useful', body: 'No guilt, no impossible routines. I have kept three of the practices for months now.', date: '11 Oct 2025' },
    { name: 'Dev A.', rating: 4, title: 'A calmer approach', body: 'Gentle, grounded and very readable. The short chapters make it easy to return to.', date: '06 Sep 2025' },
    { name: 'Ananya R.', rating: 5, title: 'A book I keep nearby', body: 'It feels like a wise friend rather than a coach shouting at you. Highly recommended.', date: '19 Jul 2025' },
  ],
  Business: [
    { name: 'Rohan D.', rating: 4, title: 'Practical and clear', body: 'A useful set of frameworks without the usual padding. I have already used one in a team workshop.', date: '13 Sep 2025' },
    { name: 'Vikram N.', rating: 5, title: 'Worth the time', body: 'Thoughtful, evidence-led and refreshingly humane about how work actually gets done.', date: '25 Aug 2025' },
    { name: 'Sara K.', rating: 4, title: 'Great for new managers', body: 'Clear examples and questions that make you think about your own habits. Very readable.', date: '08 Jul 2025' },
  ],
  Technology: [
    { name: 'Dev A.', rating: 5, title: 'Clear and human', body: 'Explains difficult ideas without talking down to you. The examples are genuinely useful.', date: '16 Oct 2025' },
    { name: 'Kabir M.', rating: 4, title: 'A solid companion', body: 'Well structured and practical. I would recommend it to anyone starting out or changing roles.', date: '04 Sep 2025' },
    { name: 'Ishita P.', rating: 5, title: 'Beautifully made', body: 'Thoughtful design, excellent diagrams and a point of view. Rare in this category.', date: '27 Jul 2025' },
  ],
  Academic: [
    { name: 'Ishita P.', rating: 5, title: 'Scholarship that reads well', body: 'Rigorous but never dry. The notes and further reading are excellent.', date: '05 Oct 2025' },
    { name: 'Rohan D.', rating: 4, title: 'A valuable overview', body: 'Balanced and clearly argued. I used it alongside my course readings and found it clarifying.', date: '11 Aug 2025' },
    { name: 'Meera S.', rating: 5, title: 'Well worth the shelf space', body: 'Beautifully produced and carefully researched. A book I will return to.', date: '02 Jun 2025' },
  ],
  "Children's": [
    { name: 'Ananya R.', rating: 5, title: 'Bedtime favourite', body: 'My six-year-old asks for this every night. The illustrations are magical and the ending is so gentle.', date: '20 Oct 2025' },
    { name: 'Meera S.', rating: 5, title: 'A beautiful gift', body: 'The production quality is wonderful. We bought a second copy for a birthday present.', date: '15 Sep 2025' },
    { name: 'Sara K.', rating: 4, title: 'Lovely to read aloud', body: 'A sweet story with a rhythm that works beautifully out loud. The pictures invite conversation.', date: '01 Aug 2025' },
  ],
  Biography: [
    { name: 'Kabir M.', rating: 5, title: 'Deeply moving', body: 'Honest without being indulgent. I finished it with a much larger sense of the world.', date: '09 Oct 2025' },
    { name: 'Ananya R.', rating: 4, title: 'A life richly told', body: 'The details stay with you — places, meals, small conversations. Beautifully written.', date: '23 Aug 2025' },
    { name: 'Vikram N.', rating: 5, title: 'Essential reading', body: 'A generous, clear-eyed memoir. I have already recommended it to three people.', date: '18 Jul 2025' },
  ],
  Poetry: [
    { name: 'Meera S.', rating: 5, title: 'Luminous', body: 'I keep this by my bed and read one poem each morning. It has changed the texture of my days.', date: '12 Oct 2025' },
    { name: 'Ishita P.', rating: 5, title: 'A perfect gift', body: 'The edition is beautiful and the poems are full of light. I bought two more as presents.', date: '30 Aug 2025' },
    { name: 'Sara K.', rating: 4, title: 'Quietly powerful', body: 'Accessible without being simple. The final section is especially strong.', date: '17 Jun 2025' },
  ],
  Comics: [
    { name: 'Rohan D.', rating: 5, title: 'Visually stunning', body: 'The art carries you through. I found myself lingering on pages just to look again.', date: '22 Oct 2025' },
    { name: 'Dev A.', rating: 4, title: 'A bold story', body: 'Ambitious and beautifully drawn. The colour work is worth the price alone.', date: '06 Sep 2025' },
    { name: 'Kabir M.', rating: 5, title: 'A new favourite', body: 'I picked this up on a whim and finished it in one evening. Already ordered another by the same artist.', date: '12 Jul 2025' },
  ],
}

/** Sample reviews for demonstration only. They are not real customer reviews. */
export function getSampleReviews(category: string): SampleReview[] {
  const bank = reviewBank[category] ?? reviewBank.Fiction
  return bank.map((review, index) => ({
    ...review,
    name: reviewers[(index + category.length) % reviewers.length],
  }))
}
