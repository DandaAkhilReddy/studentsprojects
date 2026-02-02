import { reviews } from '../../data/reviews';

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">What Students Say</h2>
        <p className="text-gray-400 text-center mb-12">Real results from <span className="text-orange-400 font-bold">10,000+ students</span> across universities worldwide</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex gap-0.5 mb-2">
                {[...Array(review.rating)].map((_, i) => (<span key={i} className="text-yellow-400 text-sm">★</span>))}
              </div>
              <p className="text-gray-300 text-xs mb-3 leading-relaxed line-clamp-4">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center font-bold text-xs text-black">{review.avatar}</div>
                <div>
                  <div className="font-semibold text-xs">{review.name}</div>
                  <div className="text-orange-400 text-xs">{review.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
