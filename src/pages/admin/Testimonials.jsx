import { useAdmin } from '../../contexts/AdminContext';

export default function TestimonialsManager() {
  const { testimonials, approveTestimonial, deleteTestimonial } = useAdmin();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Testimonials Manager</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-[#FFC107] text-xl mb-3">
              {Array(t.rating).fill(0).map((_, i) => <i key={i} className="fas fa-star"></i>)}
            </div>
            <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {!t.approved && (
                  <button
                    onClick={() => approveTestimonial(t.id)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
