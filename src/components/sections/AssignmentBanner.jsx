const AssignmentBanner = ({ onOrder }) => {
  return (
    <section className="py-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-1">📚 Need Help with Assignments?</h3>
          <p className="opacity-90">Subject-wise assignments done professionally — <span className="font-bold text-yellow-300">Only $49 per assignment!</span></p>
        </div>
        <button onClick={onOrder} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shrink-0">Order Assignment</button>
      </div>
    </section>
  );
};

export default AssignmentBanner;
